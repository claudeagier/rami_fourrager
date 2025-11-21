
# pour debian
# DC = docker-compose

# pour mint c'est pas pareille
DC = docker compose


.PHONY: refresh-service build start stop remove-data-volume fresh-db fresh-data\
update-stics init  add-admin-dev backend-test frontend-test inspect console refresh-db



# Charger les variables d'environnement du fichier .env
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# DB_CONTAINER = $(shell $(DC) ps -q db)
# DB_USER = $(DATABASE_USER)
# DB_NAME = $(DATABASE_NAME)

# export_data:
# 	@echo "Exporting data from user and authorizations tables..."
# 	@$(DC) exec db bash -c "psql -U $(DB_USER) -d $(DB_NAME) -c \"COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER DELIMITER ';' \" > /home/data/user_data.csv"
# 	@docker cp $(DB_CONTAINER):/home/data/user_data.csv ./user_data.csv
# 	@echo "Data export complete."

refresh-service:
	$(DC) up -d --build $(service)

build:
	$(DC) up -d --build

start:
	$(DC) up -d

stop:
	$(DC) down

remove-data-volume:
	docker volume rm rami_fourrager_users_data

fresh-db:
	$(DC) exec backend python manage.py create
	$(DC) exec backend python manage.py init_db

fresh-data:
	$(DC) exec backend python manage.py seed mapping_all.json
	$(DC) exec backend python manage.py seed mapping_animal_profil.json
	$(DC) exec backend python manage.py seed mapping_baguettes_fourrage.json
	
update-stics:
	$(DC) exec backend python manage.py seed mapping_baguettes_fourrage.json

add-admin-dev:
	$(DC) exec backend python manage.py add_admin_user $(ADMIN_USER_NAME) $(ADMIN_USER_EMAIL) $(ADMIN_USER_PWD)

backend-test:
	$(DC) exec backend pytest "project/tests" -p no:warnings --cov="project"

frontend-test:
	$(DC) exec frontend vue-cli-service test:unit $(what)

inspect:
	$(DC) logs -f $(service)

console:
	$(DC) exec $(service) /bin/bash

init: build fresh-db fresh-data
refresh-db: stop remove-data-volume fresh-db fresh-data