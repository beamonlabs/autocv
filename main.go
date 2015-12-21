package main

import (
    "fmt"
    "log"
    "net/http"
    "github.com/gorilla/mux"
  //  "github.com/nu7hatch/gouuid"
//    "gopkg.in/mgo.v2"
//    "gopkg.in/mgo.v2/bson"
)

type Person struct {
  Id [16] byte
  Name string
  Info string
}

func getPersonHandler(response http.ResponseWriter, request *http.Request) {
  //handles call to the /api path

  //Get id
//  vars := mux.Vars(request)
  //id := vars["id"]

  //how do we parse the god damned url
  fmt.Fprintf(response, "API CALL");

}

func main() {
  r := mux.NewRouter()

  api := r.PathPrefix("/api").Subrouter()

  api.HandleFunc("/people/{id}", getPersonHandler).Methods("GET")
  api.HandleFunc("/people", getPersonHandler).Methods("GET")

  r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/")))

  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":8080", nil))
}
