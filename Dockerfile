FROM beamonlabs/autocv:latest

COPY main $HOME
COPY frontend frontend

CMD /go/src/app/main
