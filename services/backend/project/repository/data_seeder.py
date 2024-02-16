import json
import csv
import os
import decimal
import unicodedata

from project import db
from project.repository import getModel

from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm import joinedload


def mapper(mapping_file_path):
    """
    Load mapping data from a JSON file.

    Args:
    - mapping_file_path: The file path to the JSON mapping file.

    Returns:
    - Dictionary containing the mapping data.

    Raises:
    - FileNotFoundError: If the mapping file is not found.
    - ValueError: If the mapping file does not contain a JSON object of dictionary type.
    - json.JSONDecodeError: If there is an error while reading the mapping file.
    """
    try:
        # Open the mapping file
        with open(mapping_file_path, 'r') as file:
            # Load the mapping data from the file
            mapping_data = json.load(file)

        # Check if the loaded data is a dictionary
        if not isinstance(mapping_data, dict):
            raise ValueError(
                "The mapping file should contain a JSON object of dictionary type.")

        # Return the mapping data
        return mapping_data

    except FileNotFoundError:
        # Raise an error if the mapping file is not found
        raise FileNotFoundError(
            f"The mapping file '{mapping_file_path}' is not found.")

    except json.JSONDecodeError as e:
        # Raise an error if there is an issue decoding the JSON
        raise json.JSONDecodeError(
            f"Error while reading the mapping file: {str(e)}")


def remove_diacritics(input_string):
    return ''.join(c for c in unicodedata.normalize('NFD', input_string) if unicodedata.category(c) != 'Mn')


def getCode(fromValue):
    code = remove_diacritics(fromValue.strip().lower().replace(" ", "_"))
    return code


def convert_data(data, attribute_type):
    """
    Convert data to the specified attribute type.

    Args:
    - data: The data to be converted.
    - attribute_type: The target attribute type to which data will be converted.

    Returns:
    - The converted data with the specified attribute type.
    """

    # Dictionary containing conversion functions for different attribute types
    conversion_functions = {
        int: lambda x: int(x) if x else 0,  # Convert to integer
        # decimal.Decimal: lambda x: decimal.Decimal(x.replace(',', '.') if ',' in x else x),  # Convert to Decimal
        # remplace par 0 si vide
        decimal.Decimal: lambda x: decimal.Decimal(x.replace(',', '.') if ',' in x else x if x is not '' else '0'),
        str: lambda x: x,  # No conversion needed for strings
        # Add other types and conversion functions as needed
    }

    # Retrieve the appropriate conversion function based on attribute_type
    conversion_function = conversion_functions.get(attribute_type)
    # If a conversion function exists, apply it to the data, otherwise return the data unchanged
    if conversion_function:
        return conversion_function(data)
    else:
        return data


def mapData(row, model, column_mapping):
    """
    Map data from CSV row to object attributes based on provided mapping.

    Args:
    - row: The CSV row containing data to be mapped.
    - model: The object model to which data will be mapped.
    - mapping: The mapping configuration containing column mapping information.

    Returns:
    - Dictionary containing mapped data.
    """
    obj_data = {}  # Initialize an empty dictionary to store mapped data

    # Iterate through column mapping configuration
    for csv_column, model_attribute in column_mapping.items():
        # Check if the CSV column exists in the row and it's not empty
        if csv_column in row:
            # Get the underlying data type
            attribute_type = getattr(
                model, model_attribute).property.columns[0].type.python_type
            try:
                # Convert data using convert_data function based on attribute_type
                obj_data[model_attribute] = convert_data(
                    str(row[csv_column]).stripe(), attribute_type)
            except Exception as e:
                # In case of conversion error, raise an exception
                raise ValueError(
                    f"Conversion error: Unable to convert '{row[csv_column]}' to {attribute_type}")
    return obj_data  # Return the dictionary containing mapped data


def isEqual(obj, key, value, debug=False):
    """
    Check if the value of a given attribute of the object is equal to a specified value.

    Args:
    - obj: The object whose attribute will be compared.
    - key: The key representing the attribute of the object.
    - value: The value to compare against the attribute.
    - debug: (Optional) If True, print debug information.

    Returns:
    - True if the attribute value is equal to the specified value, False otherwise.
    """
    # Get the attribute value of the object based on the provided key
    attr = getattr(obj, key)

    # Check if the attribute is a Decimal instance
    if isinstance(attr, decimal.Decimal):
        # Use Decimal's compare method to compare values
        equal = attr.compare(value) == 0
    else:
        # Use normal equality comparison for other types
        equal = (attr == value)

    # If debug mode is enabled, print debug information
    if debug:
        print(f"for {key} = {value} and obj attr value : {attr}")
        print('isEqual ?', equal)

    return equal


def isUpToDate(obj, obj_data, debug=False):
    """
    Check if the attributes of the object match the provided data.

    Args:
    - obj: The object to be checked.
    - obj_data: A dictionary containing attribute-value pairs to compare against the object's attributes.
    - debug: (Optional) If True, print debug information.

    Returns:
    - True if all attributes of the object match the provided data, False otherwise.
    """
    # Iterate through the key-value pairs in obj_data
    for key, value in obj_data.items():
        # Check if the attribute of the object matches the value from obj_data
        if not isEqual(obj, key, value, debug=debug):
            # If the attributes do not match, return False
            return False
    # If all attributes match, return True
    return True


def getObj(model, constraints, data, row):
    """
    Get an object from the database based on provided model, mapping, data, and row.

    Args:
    - model: The SQLAlchemy model used to query the database.
    - mapping: The mapping configuration containing constraints and relations.
    - data: Data used to construct filters for querying objects.
    - row: The row of data to be used for filtering.

    Returns:
    - The object retrieved from the database based on the provided criteria.

    Raises:
    - NoResultFound: If no matching object is found in the database.
    """
    filter = {}  # Initialize an empty filter
    found = False
    objs = []  # Initialize an empty list to store retrieved objects
    # Check if uniqueness constraints are defined for the parent
    if "onParent" in constraints:
        # Build the filter based on parent's uniqueness constraints
        filter = {attr: data[attr] for attr in constraints["onParent"]}
        # Query the database for objects based on the filter
        if "onRelation" in constraints:
            objs = model.query.filter_by(
                **filter).options(joinedload('*')).all()
        else:
            objs = model.query.filter_by(**filter).all()

    # If objects are found based on parent's uniqueness constraints
    if len(objs) > 0:
        # Check if uniqueness constraints are defined for relations
        if "onRelation" in constraints:
            # Build the filter based on relation's uniqueness constraints
            relation_constraints = constraints["onRelation"]
            # Iterate through the retrieved objects
            for obj in objs:
                # Iterate through the relations
                for contraint in relation_constraints:
                    if hasattr(obj, contraint['relation_name']):
                        rel_obj = getattr(obj, contraint['relation_name'])
                        # Check if the attributes match the values from the row
                        if rel_obj != None:
                            for csv_column, obj_attr in contraint['contraint_mapping'].items():
                                if hasattr(rel_obj, obj_attr):
                                    if row[csv_column] == getattr(rel_obj, obj_attr):
                                        found = True
                                        return obj
                                else:
                                    raise ValueError(
                                        f"No {obj_attr} in {rel_obj}")
                        else:
                            found = False
                    else:
                        raise ValueError(
                            f"No {contraint['relation_name']} in {model}")
        else:
            # If no uniqueness constraints on relation, return the first object
            found = True
            return objs[0]
    else:
        found = False

    # If no object is found, raise NoResultFound exception
    if not found:
        raise NoResultFound(f"can't get object for {model}")


def updateObj(obj, obj_data):
    """
    Updates the attributes of an existing object with the provided data.

    Parameters:
    - obj: The object to be updated.
    - obj_data (dict): A dictionary containing attribute-value pairs representing
      the updated data.

    Returns:
    - obj: The updated object.

    Note:
    - The function iterates through the obj_data dictionary and updates the
      corresponding attributes of the object if their values differ.

    Example:
    Consider an existing object 'obj' with attributes {'name': 'John', 'age': 30}.
    If obj_data = {'name': 'Jane', 'age': 30}, it updates the 'name' attribute
    of 'obj' to 'Jane' and returns the updated object.
    """
    for key, value in obj_data.items():
        if not isEqual(obj, key, value):
            # Update existing record if different values
            setattr(obj, key, value)
    return obj


def createPivot(parent, pivot, row, report, row_number):
    """
    Create pivot objects based on provided configuration and data.

    Args:
    - parent: The parent object associated with the pivot objects.
    - pivot: Configuration for creating pivot objects.
    - row: The row of data containing information for creating pivot objects.
    - report: Dictionary to store the report of pivot object creation.
    - row_number: The number of the current row being processed.

    Returns:
    - None
    """
    # Get the model of the pivot table based on the name provided in the "model" field
    pivot_model_name = pivot.get('model')
    if not pivot_model_name:
        raise ValueError(
            "Mapping error : Model name for pivot table is incomplete.")
    pivot_model = getModel("referential", pivot_model_name)
    if not pivot_model:
        raise ValueError(
            f"Mapping error : The model {pivot_model_name} for pivot table does not exist.")

    # Get the model of the target object based on the name provided in the "with" field
    target_model_name = pivot['is_pivot']['with']
    target_model = getModel("referential", target_model_name)
    if not target_model:
        raise ValueError(
            f"The model {target_model_name} for pivot target does not exist.")

    # Initialize rejection counter for this parent
    rejections = []

    # Initialize pivot objects created counter for this parent
    pivots_created = 0

    # Iterate through each object in the "with_mapping" list
    for mapping_entry in pivot['is_pivot']['with_mapping']:
        # Retrieve the target object with the name provided in "on_name"
        target_name = mapping_entry['on_name']
        target_obj = target_model.query.filter_by(name=target_name).first()

        # If the target object does not exist, ignore and move to the next pivot
        if not target_obj:
            rejections.append(
                {
                    "message": f"Target object with name '{target_name}' does not exist. in row {row_number}",
                    "error": f"Target object with name '{target_name}' does not exist.",
                    "csv_row": row
                }
            )
            continue

        # Map pivot data
        if 'column_mapping' in mapping_entry:
            try:
                pivot_data = mapData(
                    row, pivot_model, mapping_entry['column_mapping'])
            except ValueError as e:
                raise e

        parent_attr = pivot['on']
        target_attr = pivot['is_pivot']['on']

        # Check if a pivot with the same characteristics already exists
        existing_pivot = pivot_model.query.filter_by(
            **{
                parent_attr: parent.id,
                target_attr: target_obj.id
            }
        ).first()

        # If a pivot already exists and needs to be updated, update and move to the next pivot
        if existing_pivot:
            if not isUpToDate(existing_pivot, pivot_data):
                existing_pivot = updateObj(existing_pivot, pivot_data)
                db.session.add(existing_pivot)
                db.session.flush()
                report['modified_pivot_objects'] += 1

            continue

        # Create the pivot object and add it to the session
        pivot_entry = pivot_model(**pivot_data)

        # Add the id of the target and the id of the parent
        setattr(pivot_entry, parent_attr, parent.id)
        setattr(pivot_entry, target_attr, target_obj.id)

        db.session.add(pivot_entry)
        pivots_created += 1

    # Commit changes to the database
    db.session.commit()

    # Update the report with the number of pivot objects created and rejections
    report['created_pivot_objects'] += pivots_created
    report['rejections'].extend(rejections)


def makeSeed(row, mapping, report, csv_file, index):
    """
    Create or update objects based on provided data and mapping configuration.

    Args:
    - row: The row of data containing information for creating or updating objects.
    - mapping: The mapping configuration for mapping data to objects.
    - model: The SQLAlchemy model used for creating or updating objects.
    - report: Dictionary to store the report of object creation or update.
    - csv_file: The CSV file from which the row of data originated.
    - index: The index of the current row being processed.

    Returns:
    - True if the object creation or update is successful, False otherwise.
    """
    # get parent model
    model_name = mapping.get('model')
    if not model_name:
        raise ValueError(
            f"Mapping error : The mapping for file {csv_file} must contain a model.")
    model = getModel("referential", model_name)
    if not model:
        raise ValueError(
            f"Mapping error : The model {model_name} does not exist.")

    # Retrieve the mapping of CSV columns to parent model attributes
    column_mapping = mapping.get('column_mapping')
    if not column_mapping:
        raise ValueError(
            f"Mapping error : The mapping for file {csv_file} must specify CSV columns.")

    createParent = False
    createRelated = False
    obj = None

    try:
        # Map data to object
        obj_data = mapData(row, model, column_mapping)
    except ValueError as e:
        # If mapping fails, reject the row
        report['rejections'].append({
            'message': f"can't map data on row {index}",
            'error': str(e),
            'csv_row': row
        })
        return False

    # Get or create the parent object with CSV data
    if 'uniqueness_constraints' in mapping:
        try:
            obj = getObj(
                model, mapping['uniqueness_constraints'], obj_data, row)
        except NoResultFound:
            createParent = True
            obj = model(**obj_data)
        except SQLAlchemyError as e:
            report['rejections'].append({
                'message': f"can't get parent object in row {index}",
                'error': str(e),
                'csv_row': row
            })
            return False
    else:
        # Create new object if no constraint exists
        createParent = True
        obj = model(**obj_data)

    # Check if object data is up to date
    if not isUpToDate(obj, obj_data):
        obj = updateObj(obj, obj_data)
        report['modified_objects'] += 1

    # Add generated code to parent
    if obj:
        if hasattr(obj, 'code') and hasattr(obj, 'name'):
            if obj.code is None:
                setattr(obj, 'code', getCode(obj.name))

        # Create or update child objects with CSV data
        if 'relations' in mapping:
            relations = mapping.get('relations')
            for relation_name, relation_mapping in relations.items():
                # Get related model
                relation_model_name = relation_mapping.get('model')
                if not relation_model_name:
                    raise ValueError(
                        f"Mapping error : Relation data for {relation_name} in {csv_file} is incomplete.")
                relation_model = getModel("referential", relation_model_name)
                if not relation_model:
                    raise ValueError(
                        f"Mapping error : The model {relation_model_name} for relation {relation_name} does not exist.")

                related_obj = None
                related_obj_data = None
                # Get related database object
                if 'column_mapping' in relation_mapping:
                    try:
                        # Map data to object
                        related_obj_data = mapData(
                            row, relation_model, relation_mapping['column_mapping'])
                    except ValueError as e:
                        # If mapping fails, reject the row
                        report['rejections'].append({
                            'message': f"can't map data on row {index}",
                            'error': str(e),
                            'csv_row': row
                        })
                        return False
                else:
                    raise ValueError(
                        f"Mapping error : No column_mapping in relation {relation_name} configuration")

                related_found = False

                if "uniqueness_constraints" in relation_mapping:
                    try:
                        related_obj = getObj(
                            relation_model, relation_mapping["uniqueness_constraints"], related_obj_data, row)
                        related_found = True

                    except NoResultFound as e:
                        related_found = False
                    except Exception as e:
                        raise ValueError(
                            f"Mapping error: no attribut for {str(e)} for {relation_model}")
                else:
                    raise ValueError(
                        f"Mapping error : No uniqueness_constraint in relation {relation_name} configuration")
                if not related_found:
                    # If to_fill is True, create or update related object
                    to_fill = relation_mapping.get('to_fill')
                    if to_fill == "True":
                        # Create related object and map
                        related_obj = relation_model(**related_obj_data)
                        db.session.add(related_obj)
                        db.session.flush()
                        db.session.refresh(related_obj)
                        createRelated = True
                    elif relation_mapping.get('required') == "True":
                        report['rejections'].append({
                            'message': f"can't get related object : {relation_name} in row {index}",
                            'error': f"no related object {relation_name} to associate with {model_name} ",
                            'csv_row': row
                        })
                        return False

                setattr(obj, relation_name, related_obj)

        # Object with related objects
        db.session.add(obj)
        # Create object before pivot
        db.session.flush()
        db.session.refresh(obj)

        # Create pivots
        if 'has_pivot' in mapping:
            pivot = mapping.get('has_pivot')
            try:
                createPivot(obj, pivot, row, report, index)
            except Exception as e:
                report['rejections'].append({
                    'message': f"can't create pivot in row {index}",
                    'error': str(e),
                    'csv_row': row
                })
                return False

        # Commit the changes to the database
        db.session.commit()

        if createParent or createRelated:
            # Report creation
            report["created_objects"] += 1
        return True


def seeder(mapping={}, csv_to_seed_dir=""):
    """
    Processes CSV files based on the provided mapping and seeds the database accordingly.

    The seeder iterates through each CSV file specified in the mapping, loads data, 
    and manages database objects using the defined mapping rules.

    Parameters:
    - mapping (dict): A dictionary containing mapping information for processing CSV files.
    - csv_to_seed_dir (str): The directory path where CSV files to be seeded are located.

    Returns:
    - stat (bool): The status of the seeding process. True if successful, False otherwise.
    - err: Any error encountered during the seeding process.

    Note:
    - This function utilizes other utility functions like getModel and makeSeed.
    - It provides detailed error handling and logs a final report of the seeding process.

    Example:
    Consider a mapping dictionary specifying CSV files and their corresponding models:
    mapping = {
        "fichier_sans_relations.csv": {
            "model": "ModelSansRelation",
            "column_mapping": {
            "nom_csv": "attr_nom",
            "age_csv": "attr_age",
            "adresse_csv": "attr_adresse",
            "ajouter les colonnes à mapper": ""
            },
            "unique_constraints": ["name", "type", "climatic_year"]
        },
        "fichier_avec_relations.csv": {
            "model": "ModelAvecRelation",
            "column_mapping": {
            "nom_csv": "attr_nom",
            "age_csv": "attr_age",
            "adresse_csv": "attr_adresse",
            "ajouter les colonnes à mapper": ""
            },
            "relations": {
            "column_csv_autre_model": {
                "model": "AutreModel",
                "to_fill": "True",
                "column_mapping": {
                "champ_csv": "attr_autre_model seulement si to_fill=true",
                "ajouter les colonnes à mapper": ""
                }
            },
            "ajouter des enfants": {}
            },
            "unique_constraints": ["name", "type", "climatic_year"]
        },
        "fichier_avec_relation_sans_creation_enfant.csv": {
            "model": "model_parent",
            "column_mapping": {
            "column_csv": "attr_model",
            "ajouter les colonnes à mapper": ""
            },
            "relations": {
            "column_enfant": {
                "model": "Model_enfant",
                "to_fill": "False",
            },
            "ajouter des enfants": {}
            },
            "unique_constraints": ["name", "type", "climatic_year"]
        }
    }

    If we call seeder(mapping, '/path/to/csv/files/'), it processes each CSV file,
    creates or updates database objects based on the mapping, and returns the seeding status.
    """
    print('__________________________________________________________________________________')
    try:
        if not isinstance(mapping, dict):
            raise ValueError("The mapping must be a dictionary.")
        report = {}
        for csv_file, file_data in mapping.items():
            if not isinstance(file_data, dict):
                raise ValueError(
                    f"The mapping for file {csv_file} is malformed.")

            # Load data from the CSV file
            csv_file_path = os.path.join(csv_to_seed_dir, csv_file)

            # report for file
            report[csv_file] = {
                "total_rows": 0,
                "created_objects": 0,
                "modified_objects": 0,
                "created_related_objects": 0,
                "modified_related_objects": 0,
                "created_pivot_objects": 0,
                "modified_pivot_objects": 0,
                "rejections": [],

            }

            # work
            index = 0
            with open(csv_file_path, 'r') as file:
                reader = csv.DictReader(file, delimiter=";")
                for row in reader:
                    index += 1
                    report[csv_file]['total_rows'] += 1
                    makeSeed(row, mapping=file_data,
                             report=report[csv_file], csv_file=csv_file, index=index)
            print(f"the file :  {csv_file} has been processed ")
            print(
                '**********************************************************************************')

    except FileNotFoundError as e:
        err = f"Error opening file: {str(e)}"
        print(err)
        db.session.rollback()
        return False, err
    except json.JSONDecodeError as e:
        err = f"Error reading mapping: {str(e)}"
        print(err)
        db.session.rollback()
        return False, err
    except ValueError as e:
        err = f"Value error: {str(e)}"
        print(err)
        db.session.rollback()
        return False, err
    except SQLAlchemyError as e:
        err = f"SQLAlchemy error: {str(e)}"
        print(err)
        db.session.rollback()
        return False, err
    except Exception as e:
        err = f"An unexpected error occurred: {str(e)}"
        print(err)
        db.session.rollback()
        return False, err

    db.session.close()
    # doit retourner un état et une erreur
    err = None
    stat = True
    print("Final report : \n\r",  json.dumps(report, indent=4))
    print('__________________________________________________________________________________')

    return stat, err
