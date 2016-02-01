FROM dduportal/rpi-alpine

WORKDIR /root

EXPOSE 8080

CMD /root/main

ENV GOPATH $HOME/gohome
ENV GOBIN $HOME/gohome/bin

COPY main.sh /etc/profile.d
COPY frontend /root/frontend
COPY main.go Makefile /root/

RUN 	echo "http://dl-4.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
	apk update && \
	apk add go nodejs git make python && \
	npm install -g bower && \
	mkdir -p /root/frontend $GOPATH/bin $GOPATH/src && \
	make main && \
	apk del git python make && \
	rm -rf /var/cache/apk/*

