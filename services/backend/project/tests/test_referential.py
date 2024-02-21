import json
import pytest


def test_stics_list(client, test_database):
    # On crée un client de test pour l'API
    with client as c:
        # On appelle l'endpoint SticsList avec des paramètres valides
        response = c.get('/stics?climaticYearId=2')
        # On vérifie que la réponse est un succès (code 200)
        assert response.status_code == 200
        # On vérifie que la réponse est une liste de stics non vide
        data = json.loads(response.data.decode('utf-8'))
        assert isinstance(data, list)
        assert len(data) > 0


def test_animal_profiles_list(client):
    # On crée un client de test pour l'API
    with client as c:
        # On appelle l'endpoint AnimalProfileList avec des paramètres valides
        response = c.get('/animal-profiles?batchTypeId=6')
        print(response.__dict__)
        # On vérifie que la réponse est un succès (code 200)
        assert response.status_code == 200
        # On vérifie que la réponse est une liste de profils non vide
        data = json.loads(response.data.decode('utf-8'))
        assert isinstance(data, list)
        assert len(data) > 0


def test_generic_model_list(client):
    tests = [{
        "url": '/lists/site',
        "status": 200
    }, {
        "url": '/lists/batch-type',
        "status": 200
    }, {
        "url": '/lists/housing-type',
        "status": 200
    }, {
        "url": '/lists/climatic-year',
        "status": 200
    }, {
        "url": '/lists/totore',
        "status": 404
    }]
    with client as c:
        for test in tests:
            response = c.get(test["url"])
            print(response)
            # On vérifie que la réponse est un succès (code 200)
            assert response.status_code == test["status"]
            if test["status"] == 200:
                # On vérifie que la réponse est une liste de modèles non vide
                data = json.loads(response.data.decode('utf-8'))
                assert isinstance(data, list)
                assert len(data) > 0


def test_generic_model_detail(client):
    # On crée un client de test pour l'API
    with client as c:
        # On suppose qu'il existe un modèle site avec l'ID 1
        response = c.get('/lists/site/1')
        # On vérifie que la réponse est un succès (code 200)
        assert response.status_code == 200
        # On vérifie que la réponse est un modèle non vide
        data = json.loads(response.data.decode('utf-8'))
        assert isinstance(data, dict)
        # Assurez-vous d'adapter cette vérification selon vos besoins
        assert data['id'] == 1
