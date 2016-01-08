all: mainimage autobuilderimage

autobuilderimage: autobuilder/*
	sudo docker build -t autobuilder -f autobuilder/Dockerfile autobuilder

mainimage: main frontend/*
	sudo docker build -t autocv .

main: bower goget main.go
	go build main.go

goget:
	go get

bower:
	cd frontend ; bower install

run: bower
	go run main.go

clean:
	rm -f main
	rm -rf node_modules
