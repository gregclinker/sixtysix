docker container stop boardrunner
docker container rm boardrunner
docker run --publish 3001:3000 --env PROEJCT_NUMBER=12345678 --env CONSTITUENCY=XXXXXX --restart=always --name boardrunner boardrunner:0.1
