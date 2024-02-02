compose-up:
	sudo docker compose up --build

compose-down:
	sudo docker compose down

delete-orphans:
	sudo docker rmi $(sudo docker images --filter "dangling=true" -q --no-trunc)
