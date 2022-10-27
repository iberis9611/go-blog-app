# go-blog-app
# creating a mysql container
docker run --name mysql01 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=bunch1234 -d mysql:latest
# starting the container if it's been stopped
docker start mysql01
# entering the container
docker exec -it mysql01 bash
# entering mysql
mysql -uroot -pbunch1234
# exiting mysql
quit
# exiting the container
exit

docker run --name=mongo01 -p 27017:27017 -d mongo:latest
