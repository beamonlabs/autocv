#!/bin/bash
git clone https://git@github.com/beamonlabs/autocv
cd autocv
make
docker push beamonlabs/autocv:latest
