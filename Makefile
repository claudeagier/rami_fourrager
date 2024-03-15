
.PHONY: install start stop


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
	docker-compose exec backend python manage.py add_admin_user totoescargot toto.escargot@jardin.com mangesalade

backend-test:
	docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"

inspect:
	docker-compose logs -f $(service)

console:
	docker-compose exec $(service) /bin/bash

init: build fresh-db fresh-data
refresh-db: stop remove-data-volume fresh-db fresh-data