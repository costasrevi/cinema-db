# Cloud computing Cinema Db for upcoming Movies
## Live Demo


## Build and Run


Running with one instance of each container.

```bash
docker-compose up --build
```

## Remove

```bash
docker-compose down
```
Τεχνολογίες που χρησιμοποιήθηκαν είναι :
Για το front-end:
	JavaScript
	React
Για το back-end:
	Python
	Docker
	Flask
	Βάσεις δεδομένων 
		Postgres
		Redis

**_NOTE_** Default administrator is admin | admin

## Nginx Front-End

http://localhost:80/


## Docker cheatsheet

Remove all docker images

```bash
docker rmi $(docker images -a -q)
```

Remove all exited containers

```bash
docker rm $(docker ps -a -f status=exited -q)
```
