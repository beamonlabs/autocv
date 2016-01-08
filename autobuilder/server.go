package main

import (
	"log"
	"net/http"
	"os/exec"
)

func main() {
	log.Fatal(http.ListenAndServe(":7070", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		exec.Command("/root/script.sh")
	})))
}
