all: mainimage

pushall: pushmainimage

pushmainimage: mainimage
	sudo docker skill -f autocv beamonlabs/autocv:$(BRANCH)
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
	sudo docker run --rm -p 8080:8080 --name autocv autocv

install_dev:
	sudo apt-get install -y nodejs npm
	sudo npm install -g bower
	sudo ln -s /usr/bin/nodejs /usr/bin/node

clean:
	rm -f main
	rm -rf node_modules
