#!/bin/bash
RES=$(docker pull beamonlabs/autocv:latest | grep "newer image")
RES1=$(docker ps --all | grep "autocv")
if [ "$RES" != "" ] || [ "$RES1" == "" ] ; then
	docker rm -f autocv ;
	docker run --restart=always -p 8080:8080 --name autocv beamonlabs/autocv:latest &
fi
RES1=$(docker ps | grep "autocv")
if [ "$RES1" != "" ] ; then
	docker start autocv
fi

RES=$(docker pull beamonlabs/autobuilder:latest | grep "newer image")
RES1=$(docker ps --all | grep "autocv")
if [ "$RES" != "" ] || [ "$RES1" == "" ] ; then
	docker rm -f autobuilder ;
	docker run --restart=always -7070:7070--name autobuilder beamonlabs/autobuilder:latest &
fi
RES1=$(docker ps | grep "autobuilder")
if [ "$RES1" != "" ] ; then
	docker start autobuilder 
fi
