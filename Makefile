pushall: pushmainimage

all: mainimage

pushmainimage: mainimage
	sudo docker tag -f autocv beamonlabs/autocv:$(BRANCH)
	sudo docker push beamonlabs/autocv:$(BRANCH)

mainimage:
	sudo docker build --rm -t autocv .

main: bower goget main.go
	go build main.go

npm:
	npm install frontend

goget:
	go get

bower:
	cd frontend; bower --allow-root install

run: mainimage
	sudo docker run --rm --link mongo -p 8080:8080 --name autocv autocv

runmongo:
	sudo docker run -d --restart=always --name mongo -p 27030:27017 dhermanns/rpi-mongo

install_dev:
	sudo apt-get install -y nodejs npm
	sudo npm install -g bower
	sudo ln -s /usr/bin/nodejs /usr/bin/node

clean:
	rm -f main
	rm -rf node_modules
