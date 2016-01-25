package main

import (
  "io"
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"
  "github.com/gorilla/mux"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  //  "github.com/nu7hatch/gouuid"
)

type Person struct {
  Id string
  Name string
  Info string
}

type Persons []Person


func getPersonHandler(response http.ResponseWriter, request *http.Request) {
  //handles call to the /api path

  //Get id
  vars := mux.Vars(request)
  id := vars["id"]

  person := GetPersonById(id);
  response.Header().Set("Content-Type", "application/json; charset=UTF-8")
  response.WriteHeader(http.StatusOK)
  if err := json.NewEncoder(response).Encode(person); err != nil {
      panic(err)
  }
}

func deletePersonHandler(response http.ResponseWriter, request *http.Request) {
  //handles call to the /api path

  //Get id
  vars := mux.Vars(request)
  id := vars["id"]

  DeletePersonById(id);
  response.Header().Set("Content-Type", "application/json; charset=UTF-8")
  response.WriteHeader(http.StatusOK)
}

func DeletePersonById(id string) {
  Execute(func(session *mgo.Session) {
    err := session.DB("autocv").C("person").Remove(bson.M{"id": id})
    if err != nil {
      panic(err)
    }
  })
}

func getPersonsHandler(response http.ResponseWriter, request *http.Request) {
  persons := GetAllPeople();
  response.Header().Set("Content-Type", "application/json; charset=UTF-8")
  response.WriteHeader(http.StatusOK)
  if err := json.NewEncoder(response).Encode(persons); err != nil {
      panic(err)
  }
}

func postPersonHandler(response http.ResponseWriter, request *http.Request) {
  //deserialize Person

  //save to db
  var person Person
    body, err := ioutil.ReadAll(io.LimitReader(request.Body, 1048576))
    if err != nil {
        panic(err)
    }
    if err := request.Body.Close(); err != nil {
        panic(err)
    }
    if err := json.Unmarshal(body, &person); err != nil {
        response.Header().Set("Content-Type", "application/json; charset=UTF-8")
        response.WriteHeader(422) // unprocessable entity
        if err := json.NewEncoder(response).Encode(err); err != nil {
            panic(err)
        }
    }

    StorePerson(person)
    response.Header().Set("Content-Type", "application/json; charset=UTF-8")
    response.WriteHeader(http.StatusCreated)
}

func GetPersonById(id string) Person {
  result := Person{}

  Execute(func(session *mgo.Session) {
    all := session.DB("autocv").C("person")
    err := all.Find(bson.M{"id": id}).One(&result)
    if err != nil {
           log.Fatal(err)
    }
  })

  return result;
}

func GetAllPeople() Persons {
  var persons Persons
  Execute(func(session *mgo.Session) {
    all := session.DB("autocv").C("person")
    err := all.Find(nil).All(&persons)
    if err != nil {
           log.Fatal(err)
    }
  })
  return persons
}

func StorePerson(person Person) {
  Execute(func(session *mgo.Session) {
    session.DB("autocv").C("person").Insert(person)
  })
}

func Execute(fn func(session *mgo.Session)) {
  session := GetSession();
  defer session.Close()
  fn(session);
}

func GetSession() *mgo.Session {
  session, err := mgo.Dial("mongo")
  if err != nil {
    panic(err)
  }
  return session;
}


func main() {
  r := mux.NewRouter()

  api := r.PathPrefix("/api").Subrouter()

  api.HandleFunc("/people/{id}", getPersonHandler).Methods("GET")
  api.HandleFunc("/people/{id}", deletePersonHandler).Methods("DELETE")

  api.HandleFunc("/people/", getPersonsHandler).Methods("GET")

  api.HandleFunc("/people/", postPersonHandler).Methods("POST")

  r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/")))

  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":8080", nil))
}
