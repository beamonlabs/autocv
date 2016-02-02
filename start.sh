#!/bin/bash
#IP=$(getent hosts mongo | awk '{print $1}')
#PORT=$MONGO_PORT
CONNSTRING="${MONGO_PORT/tcp/mongodb}"
echo $CONNSTRING
./main $CONNSTRING
