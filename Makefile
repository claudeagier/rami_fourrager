.PHONY: install start stop

install:
	docker-compose up -d --build
	docker-compose exec backend python manage.py create
	docker-compose exec backend python manage.py seed

start:
	docker-compose up -d

stop:
	docker-compose down

test:
	docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"

logs:
	docker-compose logs -f $(service)
