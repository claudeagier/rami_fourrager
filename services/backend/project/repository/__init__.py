# import all models here for showib=ng to sqlalchemy 
import project.repository.referentials.models as referentialModule
import project.repository.users.models as usersModule

#declare other module to access to his specific classes
modules = {
    "referential" : referentialModule
}

def getModel(module, model_name):
    """
    Retrieves a specific model class from the specified module.

    Parameters:
    - module (str): The module name where the model class is located.
    - model_name (str): The name of the model class to retrieve.

    Returns:
    - model: The model class if found, otherwise None.

    Raises:
    - ValueError: If the specified module is not found in the available modules.

    Note:
    - The function expects a predefined set of modules with model classes.
    - It retrieves the model class based on the module and model name provided.

    Example:
    Consider module referential containing model classe 'Site':

    If we call getModel("referential", "Site"), it retrieves the Site model class from the 'referential' module.
    """
    if module in modules:
        module = modules[module]  # Référence au module
        model = getattr(module, model_name, None)  # Obtenez le modèle à partir du nom
    else:
        raise ValueError("module not found")
    
    return model