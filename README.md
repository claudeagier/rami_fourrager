# Rami fourrager

## Flask REST Plus, VueJS, et tests unitaires automatisés via Flask CLI

Solution Docker basée sur le développement piloté par les tests (Test Driven Development) utilisant VueJS, Flask, PostgreSQL, avec Swagger, et authentification préconstruite + JWT, le tout fonctionnant sur NGINX/https.
Il existe un fichier Make pour effectuer toutes les opérations nécessaires.

### 1. Le fichier d'environnement

A la racine du projet,
Renommer le fichier env.sample en .env
Compléter le fichier .env avec les iformations nécessaires


### 2. Les fichiers à injecter en bdd

Déposer les fichiers csv correctement formaté dans le répertoire services/backend/referential  
Déposer les fichiers .json pour le mapping des données.



### 3. Get started

```$ make init```

### 4. Ajouter l'administrateur

```$ make add-admin-dev```

### 5. Connection

``` http://localhost:8080/ ```

### 6. Les tests unitaires

#### 1.Backend

```$ make backend-test```

#### 2.Frontend

```$ make frontend-test```

expect/assert documentation: `https://jestjs.io/docs/expect`

### 7. Swagger URL

``` http://localhost:5001/swagger ```

-----------------------------------------------------------

### 8. Mise à jour des référentiels
modifier le fichier csv dans lequel ont veut ajouter des données.
ensuite faire

```$ make fresh-data```

une commande spécifique est prévue pour ajouter des baguettes de fourrage.

```$ make update-stics```

### In case you need to regenerate SSL keys

Open the command line and run these commands inside the ```services/nginx/ssl``` folder to generate a self signed certificate:

``` openssl req -new -newkey rsa:1024 -x509 -sha512 -days 365 -nodes -out nginx.crt -keyout nginx.key ```

``` openssl dhparam -out dhparam.pem 1024 ```

-----------------------------------------------------------

Pour un déploiement sur windows, il faut éditer le fichier entrypoint.sh pour changer le crlf en lf. (end of line sequence)