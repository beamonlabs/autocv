all: bower
	go build main.go

bower:
	cd frontend ; bower install

run: bower
	go run main.go

clean:
	rm main
