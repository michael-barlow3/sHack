## Copy (vis SCP) files from Jumpbox to individual ENV servers

scp -i vsr-key-pair.pem *.zip ec2-user@1<SERVER IP>:~/ENVS

## Background Tasks

### SSH into each individual ENV server and run the following steps.

```
rm -rf *.sh *.env
unzip ENVS.zip
vi CommonEnv_List.env

# Fill in the RedisServer, RedisPort, MongoURL variables at the bottom of the file
# from the list earlier in the file

chmod 711 *.sh
sudo docker stop metadata subscriber utils redshift
sudo docker rm metadata subscriber utils redshift
sudo docker rmi metadata subscriber utils redshift
sudo docker system prune

./pullMetadata.sh
./pullSubscriber.sh
./pullutils.sh
./pullRedshift.sh
./metadata.sh
./subscriber.sh
./redshift.sh
./utils.sh

# Check if things are working...
sudo docker logs -f --tail 20 metadata
sudo docker logs -f --tail 20 subscriber
sudo docker logs -f --tail 20 redshift
sudo docker exec -it utils bash

```

## GUI

```
sudo unzip vsr_gui.zip -d /var/www/vsr
sudo chmod 555 /var/www/vsr/index.html
sudo chmod 555 /var/www/vsr/static -R
```

Permissions are weird so
```
sudo ls -al /var/log/httpd
then have to 
sudo cp /var/log/httpd/error_log ~/
sudo chmod 555 ~/error_log
```
Also, /var/www/vsr needs to be executable (sudo chmod 755 ???)
