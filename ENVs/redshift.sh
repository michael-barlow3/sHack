sudo docker rm -f redshift
sudo docker run -d --restart always --name redshift --env-file ./CommonEnv_List.env redshift