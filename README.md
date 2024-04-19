## Flask REST Plus, VueJS, and automated unit testing via Flask CLI 
Test driven docker solution using VueJS, Flask, PostgresSQL, with swagger, & prebuilt authentication+JWT's running on NGINX/https

### 1. Getting Started

``` docker-compose up -d --build ```


### 2. Seed Postgres DB with Flask CLI

```docker-compose exec backend python manage.py create```

```docker-compose exec backend python manage.py seed```

### The default login creds that seed the db are:

<p><strong>User: </strong>  <em>avengers@gmail.com </em></p>
<p><strong>Pass: </strong>  <em>supersecret </em></p>


### 3. The VueJS UI will be on:

``` https://localhost:4433/ ```

### 4. The backend API routes will be on:

``` https://localhost:4433/<api route> ```

### 5. Then see the json returned from the users API route here:

``` http://localhost:5001/users ```

### 6. Run automated unit tests

#### 1.Backend

```docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"```

#### 2.Frontend

expect/assert documentation: `https://jestjs.io/docs/expect`

```$ make frontend-test```

### 7. Swagger URL

``` http://localhost:5001/swagger ```

-----------------------------------------------------------

### In case you need to regenerate SSL keys

Open the command line and run these commands inside the ```services/nginx/ssl``` folder to generate a self signed certificate:

``` openssl req -new -newkey rsa:1024 -x509 -sha512 -days 365 -nodes -out nginx.crt -keyout nginx.key ```

``` openssl dhparam -out dhparam.pem 1024 ```

-----------------------------------------------------------

``` $ python manage.py seed_data mapping_concentrate.json ```

test un fichier
```python -m pytest -k test_referential.py -W ignore```
