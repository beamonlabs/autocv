FROM hypriot/rpi-golang:latest

WORKDIR /root

RUN 	apt-get update && \
	apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm install -g --allow-root npm@latest
RUN npm install -g --allow-root bower

EXPOSE 8080

CMD /root/main

RUN mkdir -p $GOROOT/bin $GOROOT/src
ENV GOBIN $GOROOT/bin

COPY main.sh /etc/profile.d

RUN mkdir -p /root/frontend
COPY frontend /root/frontend
COPY main.go Makefile /root/

RUN  make main

