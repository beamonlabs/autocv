all: pushmain pushautobuilder

pushautobuilder: autobuilderimage
	sudo docker push beamonlabs/autobuilder.latest

pushmain: mainimage
	sudo docker push beamonlabs/autocv:latest

autobuilderimage: autobuilder/*
	sudo docker build -t beamonlabs/autobuilder:latest -f autobuilder/Dockerfile autobuilder

mainimage: main frontend/*
	sudo docker build -t beamonlabs/autocv:latest .

main: bower main.go
	go build main.go
bower:
	cd frontend ; bower install

run: bower
	go run main.go

clean:
	rm main
