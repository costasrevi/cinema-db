# cloud computing





Running with one instance of each container.

```bash
docker-compose up --build
```

## Remove

```bash
docker-compose down
```

**_NOTE_** Default administrator is admin | admin

## Docker cheatsheet

Remove all docker images

```bash
docker rmi $(docker images -a -q)
```

Remove all exited containers

```bash
docker rm $(docker ps -a -f status=exited -q)
```
