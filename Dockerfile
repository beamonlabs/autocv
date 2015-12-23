FROM beamonlabs/autocv:latest

COPY main main
COPY frontend frontend

CMD /go/src/app/main
