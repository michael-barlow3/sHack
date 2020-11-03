sudo docker rm -f utils
sudo docker run -d --name utils --env-file ./CommonEnv_List.env utils
