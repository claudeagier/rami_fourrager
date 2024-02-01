
.PHONY: install start stop

install:
	docker-compose up -d --build

start:
	docker-compose up -d

stop:
	docker-compose down

test:
	docker-compose exec backend pytest "project/tests" -p no:warnings --cov="project"

inspect:
	docker-compose logs -f $(service)

console:
	docker-compose exec $(service) /bin/bash
