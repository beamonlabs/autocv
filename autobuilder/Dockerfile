FROM hypriot/rpi-golang
RUN apt-get update && apt-get install -y vim git
EXPOSE 7070 7070

CMD go run /root/server.go

COPY script.sh server.go /root/
