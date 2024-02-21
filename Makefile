
.PHONY: install start stop

install:
	docker-compose up -d --build


refresh-service:
	docker-compose up -d --build $(service)

start:
	docker-compose up -d

stop:
	docker-compose down


db-fresh:
	docker-compose exec backend python manage.py seed mapping_all.json
	docker-compose exec backend python manage.py seed mapping_animal_profil.json
	docker-compose exec backend python manage.py seed mapping_baguettes_fourrage.json

backend-test:
	docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"

inspect:
	docker-compose logs -f $(service)

console:
	docker-compose exec $(service) /bin/bash
