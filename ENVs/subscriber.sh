sudo docker rm -f subscriber
sudo docker run -d --restart always --name subscriber --env-file ./CommonEnv_List.env subscriber_r2
