FROM hypriot/rpi-golang:latest
EXPOSE 8080 8080
ADD main.go /root/

CMD go run /root/main.go
