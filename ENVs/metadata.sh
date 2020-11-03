sudo docker rm -f metadata
sudo docker run -d --restart always --name metadata -p 8081:8081 --env-file ./CommonEnv_List.env metadata_r2
