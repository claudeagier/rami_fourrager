import json
import csv
import os
import decimal


from project import db
from project.repository import getModel

from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm.exc import NoResultFound

def mapper(mapping_file_path):
    """
    Loads mapping data from a JSON file.

    Parameters:
    - mapping_file_path (str): The path to the JSON file containing mapping data.

    Returns:
    - mapping_data (dict): A dictionary containing mapping information loaded from the file.
      If the file is not found or cannot be read, an empty dictionary is returned.

    Example:
    If we call mapper('/path/to/mapping_file.json'), it loads the mapping data from the JSON file
    located at the specified path and returns the mapping_data dictionary.
    """
    try:
        with open(mapping_file_path, 'r') as file:
            mapping_data = json.load(file)
        if not isinstance(mapping_data, dict):
            raise ValueError("The mapping file should contain a JSON object of dictionary type.")
        return mapping_data
    except FileNotFoundError:
        print(f"The mapping file '{mapping_file_path}' is not found.")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error while reading the mapping file: {str(e)}")
        return {}

def mapData(row, mapping):
    """
    Maps data from a CSV row to attributes based on a provided mapping.

    Parameters:
    - row (dict): A dictionary representing a single row of data from a CSV file.
    - mapping (dict): A dictionary containing the mapping information with keys:
        - "column_mapping" (dict): A dictionary where keys represent CSV column names
          and values represent corresponding model attributes.

    Returns:
    - obj_data (dict): A dictionary containing the mapped data where keys represent
      model attributes and values represent data from the CSV row. Only attributes
      specified in the mapping are included in the output.

    Example:
    If row = {'name': 'John', 'age': 30, 'city': 'New York'}
    and mapping = {'column_mapping': {'name': 'full_name', 'age': 'user_age'}},
    the function returns {'full_name': 'John', 'user_age': 30}.
    """
    obj_data = {}
    for csv_column, model_attribute in mapping["column_mapping"].items():
        if csv_column in row:
            obj_data[model_attribute] = row[csv_column]
    return obj_data

def makeFilter(mapping , data, row):
    """
    Constructs a filter based on the provided mapping, data, and row information.

    Parameters:
    - mapping (dict): A dictionary containing mapping information with keys:
        - "uniqueness_constraints" (dict): A dictionary defining uniqueness constraints.
          It may contain keys 'onParent' and/or 'onRelation' to specify constraints
          based on parent and relation models respectively.
    - data (dict): A dictionary containing data relevant to the mapping.
    - row (dict): A dictionary representing a single row of data.

    Returns:
    - filter (dict): A dictionary representing the constructed filter based on
      uniqueness constraints. It combines filters based on parent and relation models.

    Raises:
    - ValueError: If the referenced model for a relation does not exist.

    Example:
    Consider a mapping with uniqueness constraints:
    mapping = {
        'uniqueness_constraints': {
            'onParent': ['parent_attribute'],
            'onRelation': {
                'child_model_name': {
                    'model': 'child_model_name',
                    'search_key': {'csv_column': 'object_attribute'}
                }
            }
        }
    }
    If data = {'parent_attribute': 'value1'} and row = {'csv_column': 'value2'},
    the function constructs a filter {'parent_attribute': 'value1', 'child_model_name_id': 123}.
    """
    uniqueness_constraints = mapping['uniqueness_constraints']
    parent_filter={}
    relation_filter = {}
    if "onParent" in uniqueness_constraints:     
        # Construire le filtre basé sur les contraintes d'unicité du parent
        parent_filter = {attr: data[attr] for attr in uniqueness_constraints["onParent"]}
        
    if "onRelation" in uniqueness_constraints:    
        # Construire le filtre basé sur les contraintes d'unicité des relations
        relations = mapping.get("relations", {})
        relation = uniqueness_constraints["onRelation"]
        for child_name in relation:
            mod = relations[child_name]['model']
            child_model = getModel("referential",mod)
            if not child_model:
                raise ValueError(f"The model {mod} for relation {child_name} does not exist.")
            for csv_column, obj_attr in relations[child_name]['search_key'].items():
                child_obj = child_model.query.filter_by(**{obj_attr : row[csv_column]}).first()
                if child_obj is not None:
                    key = child_name+"_id"
                    relation_filter = {key : child_obj.id}       
    # Combiner les filtres parent et relation
    return {**parent_filter, **relation_filter}

def isEqual(obj, key, value):
    """
    Checks if the value of a specified attribute of an object matches a given value.

    Parameters:
    - obj (object): The object whose attribute is to be checked.
    - key (str): The name of the attribute to be checked.
    - value (any): The value to compare the attribute against.

    Returns:
    - equal (bool): True if the attribute value matches the given value, False otherwise.

    Note:
    - If the attribute is an instance of `decimal.Decimal`, it compares the values using
      `decimal.Decimal.compare()`.
    - For non-decimal attributes, it performs a simple equality comparison.

    Example:
    Consider an object 'obj' with an attribute 'age' and value 30.
    If we call isEqual(obj, 'age', 30), it returns True.
    """
    attr = getattr(obj, key)
    if isinstance(attr, decimal.Decimal):
        valueToCompare = decimal.Decimal(value)
        equal = attr.compare(valueToCompare) == 0
    else:
        equal = (attr == value)
    return equal

def isToUpdate(obj, obj_data):
    """
    Checks if the attributes of an object match the values in the provided data dictionary.

    Parameters:
    - obj (object): The object to be checked for updates.
    - obj_data (dict): A dictionary containing attribute-value pairs representing the
      updated data to be compared against the object's attributes.

    Returns:
    - to_update (bool): True if the object's attributes match the values in obj_data,
      False otherwise.

    Note:
    - The function utilizes the isEqual function to compare attribute values.

    Example:
    Consider an object 'obj' with attributes {'name': 'John', 'age': 30}.
    If obj_data = {'name': 'John', 'age': 30}, it returns True.
    If obj_data = {'name': 'Jane', 'age': 30}, it returns False.
    """
    for key, value in obj_data.items():
        if not isEqual(obj, key, value):
            return False
    return True

def getObj(model, mapping, data, row ):
    """
    Retrieves a single object from the database based on the provided model, mapping, data, and row.

    Parameters:
    - model: The database model class representing the type of object to retrieve.
    - mapping (dict): A dictionary containing mapping information for constructing filters.
    - data (dict): A dictionary containing data relevant to the mapping.
    - row (dict): A dictionary representing a single row of data.

    Returns:
    - obj: The retrieved object from the database that matches the provided criteria.

    Note:
    - The function constructs a filter using the makeFilter function based on the mapping,
      data, and row information.

    Example:
    Consider a model 'User' with a mapping and data relevant to its attributes.
    If we call getObj(User, mapping, data, row), it retrieves a single User object
    from the database based on the constructed filter.
    """
    filter = makeFilter(mapping, data, row)
    return model.query.filter_by(**filter).one()

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
    
def makeSeed(row, mapping, model, report, csv_file):
    """
    Processes a row of data from a CSV file, creates or updates corresponding objects,
    and manages relationships based on the provided mapping and model.

    Parameters:
    - row (dict): A dictionary representing a single row of data from a CSV file.
    - mapping (dict): A dictionary containing mapping information for data processing.
    - model: The database model class representing the type of object to be created or updated.
    - report (dict): A dictionary containing a report of object creation and modification statistics.
    - csv_file (str): The name of the CSV file being processed.

    Returns:
    - None

    Note:
    - This function utilizes other utility functions like mapData, getObj, isToUpdate, updateObj, getModel.

    Example:
    Consider a CSV row with data mapped to models and relationships.
    If we call makeSeed(row, mapping, model, report, 'example.csv'), it processes the row,
    creates or updates corresponding objects, manages relationships, and updates the report accordingly.
    """
    createParent = False
    createRelated = False
    
    obj_data = mapData(row, mapping)
    
    # get or Create the parent object with CSV data
    if 'uniqueness_constraints' in mapping:
        try:
            obj = getObj(model, mapping, obj_data, row)
        except IntegrityError as e:
            print(f"Integrity Error: {str(e)}")
        except NoResultFound:
            createParent = True
            obj = model(**obj_data)   
    else:
        #create new if no constraint
        createParent = True
        obj = model(**obj_data)
    if not isToUpdate(obj, obj_data):
        obj = updateObj(obj,obj_data)
        report['modified_objects'] += 1
        
    # obj
    if obj:
        # create or update child obj with csv data
        if 'relations' in mapping:
            relations = mapping.get('relations')
            for relation_name, relation_data in relations.items():
                relation_model_name = relation_data.get('model')
                if not relation_model_name:
                    raise ValueError(f"Relation data for {relation_name} in {csv_file} is incomplete.")

                relation_model = getModel("referential",relation_model_name)
                if not relation_model:
                    raise ValueError(f"The model {relation_model_name} for relation {relation_name} does not exist.")
                # instanciate in good scope
                related_obj_data = None
                
                to_fill = relation_data.get('to_fill')
                if to_fill:
                    #get related model
                    search_key = relation_data['search_key']
                    if not search_key:
                        raise ValueError(f"Search key is missing for relation {relation_name} in {csv_file}.")

                    for search_csv_field, search_model_field in search_key.items():
                        search_value = row[search_csv_field]
                        related_obj = relation_model.query.filter_by(**{search_model_field: search_value}).one_or_none()
                else:
                    #create related_obj and map
                    if 'column_mapping' in relation_data:
                        related_obj_data = mapData(row, relation_data)
                        createRelated = True
                        related_obj =  relation_model(**related_obj_data)
        
                if related_obj:
                    #or update existing related 
                    if related_obj_data and not isToUpdate(related_obj, related_obj_data):
                        related_obj = updateObj(related_obj, related_obj_data)
                        report['modified_objects'] += 1
        
                    db.session.add(related_obj)
                    db.session.flush()
                    db.session.refresh(related_obj)
                    
                    setattr(obj, relation_name, related_obj)

        #obj with related obj
        db.session.add(obj)
            
        # Commit the changes to the database
        db.session.commit()
        
        if createParent or createRelated:
            #report creation
            report["created_objects"] +=1
    
def seeder(mapping={}, csv_to_seed_dir = ""):
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
                "search_key": {
                "column_csv_1": "seulement si to_fill = false",
                "column_csv_2": "attr_model_enfant_2"
                }
            },
            "ajouter des enfants": {}
            },
            "unique_constraints": ["name", "type", "climatic_year"]
        }
    }

    If we call seeder(mapping, '/path/to/csv/files/'), it processes each CSV file,
    creates or updates database objects based on the mapping, and returns the seeding status.
    """
    try:
        if not isinstance(mapping, dict):
            raise ValueError("The mapping must be a dictionary.")

        report = {}       
        for csv_file, file_data in mapping.items():
            if not isinstance(file_data, dict):
                raise ValueError(f"The mapping for file {csv_file} is malformed.")

            # get parent model
            model_name = file_data.get('model')
            if not model_name:
                raise ValueError(f"The mapping for file {csv_file} must contain a model.")
            model = getModel("referential",model_name)
            if not model:
                raise ValueError(f"The model {model_name} does not exist.")
            
            # Retrieve the mapping of CSV columns to parent model attributes
            column_mapping = file_data.get('column_mapping')
            if not column_mapping:
                raise ValueError(f"The mapping for file {csv_file} must specify CSV columns.")

            # Load data from the CSV file
            csv_file_path = os.path.join(csv_to_seed_dir, csv_file)
            
            #report for file
            report[csv_file]={
                "total_rows": 0,
                "created_objects": 0,
                "modified_objects": 0,
                "rejected_rows": []
            }
            
            # work
            with open(csv_file_path, 'r') as file:
                reader = csv.DictReader(file, delimiter=";")
                for row in reader:
                    report[csv_file]['total_rows'] += 1
                    makeSeed(row, mapping=file_data, model=model, report = report[csv_file], csv_file=csv_file)
            print(f"the file :  {csv_file} has been processed ")

    except FileNotFoundError as e:
        print(f"Error opening file: {str(e)}")
        db.session.rollback()
    except json.JSONDecodeError as e:
        print(f"Error reading mapping: {str(e)}")
        db.session.rollback()
    except ValueError as e:
        print(f"Value error: {str(e)}")
        db.session.rollback()
    except SQLAlchemyError as e:
        print(f"SQLAlchemy error: {str(e)}")
        db.session.rollback()
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        db.session.rollback()
        
    db.session.close()             
    #doit retourner un état et une erreur   
    err = None     
    stat = True
    print("Final report : \n\r",  json.dumps(report, indent=4))
    return stat, err

# def default_seeder(model, csv_file, column_mapping):
#     try:
#         with open(csv_file, 'r') as file:
#             reader = csv.DictReader(file, delimiter=";", quotechar='"')
#             for row in reader:
#                 # Création d'un dictionnaire des données à partir du mapping
#                 data = {model_field: row[csv_field] for csv_field, model_field in column_mapping.items()}
                
#                 # Création d'une instance du modèle avec les données du CSV
#                 instance = model(**data)
                
#                 # Ajout de l'instance à la session et commit dans la base de données
#                 db.session.add(instance)
#                 db.session.commit()
                
#                 print(f"Data seeded for {model.__name__}.")
#     except FileNotFoundError:
#         print(f"File not found: {csv_file}")
#     except IntegrityError:
#         db.session.rollback()
#         print(f"IntegrityError for {model.__name__}. Skipping...")
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error seeding {model.__name__}: {e}")
