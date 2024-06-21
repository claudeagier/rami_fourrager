
.PHONY: install start stop

# # Charger les variables d'environnement du fichier .env
# ifneq (,$(wildcard ./.env))
#     include .env
#     export
# endif

# DB_CONTAINER = $(shell docker-compose ps -q db)
# DB_USER = $(DATABASE_USER)
# DB_NAME = $(DATABASE_NAME)

# export_data:
# 	@echo "Exporting data from user and authorizations tables..."
# 	@docker-compose exec db bash -c "psql -U $(DB_USER) -d $(DB_NAME) -c \"COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER DELIMITER ';' \" > /home/data/user_data.csv"
# 	@docker cp $(DB_CONTAINER):/home/data/user_data.csv ./user_data.csv
# 	@echo "Data export complete."

refresh-service:
	docker-compose up -d --build $(service)

build:
	docker-compose up -d --build

start:
	docker-compose up -d

stop:
	docker-compose down

remove-data-volume:
	docker volume rm rami_fourrager_users_data

fresh-db:
	docker-compose exec backend python manage.py create
	docker-compose exec backend python manage.py init_db

fresh-data:
	docker-compose exec backend python manage.py seed mapping_all.json
	docker-compose exec backend python manage.py seed mapping_animal_profil.json
	docker-compose exec backend python manage.py seed mapping_baguettes_fourrage.json
	
update-stics:
	docker-compose exec backend python manage.py seed mapping_baguettes_fourrage.json

add-admin-dev:
	docker-compose exec backend python manage.py add_admin_user $(ADMIN_USER_NAME) $(ADMIN_USER_EMAIL) $(ADMIN_USER_PWD)

backend-test:
	docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"

frontend-test:
	docker-compose exec frontend vue-cli-service test:unit $(what)

inspect:
	docker-compose logs -f $(service)

console:
	docker-compose exec $(service) /bin/bash

init: build fresh-db fresh-data
refresh-db: stop remove-data-volume fresh-db fresh-data