#!/bin/bash
IP=$(getent hosts mongo | awk '{print $1}')
PORT=$MONGO_PORT
CONNSTRING="mongodb://$IP:$PORT"
ehco $CONNSTRING
./main $CONNSTRING
