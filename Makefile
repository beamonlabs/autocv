all: bower main dev

dev: main Dockerfile.dev
	sudo docker build -t beamonlabs/autocv:devm -f Dockerfile.dev .

rundev: dev
	sudo docker run -p 8080:8080 beamonlabs/autocv:devm

rundevi: dev
	sudo docker run -t -i -p 8080:8080 beamonlabs/autocv:devm /bin/bash
main: main.go
	go build main.go

bower:
	cd frontend ; bower install

run: bower
	go run main.go

clean:
	rm main
