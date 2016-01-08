package main

import (
	"log"
	"net/http"
	"os/exec"
	"fmt"
	"io/ioutil"
)

func main() {
	log.Fatal(http.ListenAndServe(":7070", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// handle error
		}
		fmt.Printf(string(body))
		exec.Command("/root/script.sh")
	})))
}
