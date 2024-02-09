# import all models here for showib=ng to sqlalchemy 
import project.repository.referentials.models as referentialModule
import project.repository.users.models as usersModule

modules = {
    "referential" : referentialModule
}

def getModel(module, model_name):
    if module in modules:
        module = modules[module]  # Référence au module
        model = getattr(module, model_name, None)  # Obtenez le modèle à partir du nom
    else:
        raise ValueError("module not found")
    
    return model