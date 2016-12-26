npm install
bower install
grunt build
docker network create --subnet 203.0.113.0/24 subnet
docker build -t claveunica .
docker run --rm -it --net subnet --ip 203.0.113.2 claveunica