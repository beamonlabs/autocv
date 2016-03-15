#!/bin/bash
DATE=date "+%Y-%m-%d_%H:%M"
docker tag beamonlabs/autocv:prod beamonlabs/autocv:$DATE
docker tag beamonlabs/autocv:latest beamonlabs/autocv:prod
docker stop autocv
docker rename autocv autocv_$DATE
docker run -d --name autocv --volumes_from autocv_data -p 8080:8080 --net=dmz beamonlabs/autocv:prod
docker push beamonlabs/autocv:prod
docker push beamonlabs/autocv:$DATE
docker rm -f autocv_$DATE
