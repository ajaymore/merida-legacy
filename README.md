## Setup

### Building production docker

```
docker login
cd server
docker build -t mysticalaj/node-web-app .
docker tag mysticalaj/node-web-app mysticalaj/node-web-app:latest
docker push mysticalaj/node-web-app:latest
docker-compose up # after updating the docker-compose.yml with latest build
```

## Production environment

* secure flag would be true for prod environment, hence app should be served over https
