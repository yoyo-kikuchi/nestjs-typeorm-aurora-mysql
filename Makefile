.PHONY: up-databases dwon destroy


up-databases:
	docker-compose -f .devcontainer/docker-compose.yml up -d master slave

dwon:
	docker-compose -f .devcontainer/docker-compose.yml down

destroy:
	docker-compose -f .devcontainer/docker-compose.yml down --rmi all --volumes --remove-orphans