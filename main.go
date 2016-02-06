package main

import (
  "io"
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"
  "github.com/gorilla/mux"
  "github.com/garyburd/redigo/redis"
)

type Tag struct  {
  Name string
  Description string
}

type Tags []Tag

type Project struct {
  Id string
  Name string
  Description string
  Tags Tags
}

type Projects []Project

type Person struct {
  Name string
  Email string
  Info string
  Projects Projects
  Tags Tags
  WantedSkills Tags
  TeachingSkills Tags
}

type Persons []Person


func getPersonHandler(response http.ResponseWriter, request *http.Request) {
  //handles call to the /api path

  //Get id
  vars := mux.Vars(request)
  email := vars["email"]

  person := GetPersonByEmail(email);
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
  email := vars["email"]

  DeletePersonByEmail(email);
  response.Header().Set("Content-Type", "application/json; charset=UTF-8")
  response.WriteHeader(http.StatusOK)
}

func DeletePersonByEmail(email string) {
  Execute(func(session redis.Conn) {
    err := session.Do("LREM", email)
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

func getTagsHandler(response http.ResponseWriter, request *http.Request) {
  tags := GetAllTags();
  response.Header().Set("Content-Type", "application/json; charset=UTF-8")
  response.WriteHeader(http.StatusOK)
  if err := json.NewEncoder(response).Encode(tags); err != nil {
      panic(err)
  }
}

func postTagHandler(response http.ResponseWriter, request *http.Request) {
  //deserialize Person

  //save to db
  var tag Tag
    body, err := ioutil.ReadAll(io.LimitReader(request.Body, 1048576))
    if err != nil {
        panic(err)
    }
    if err := request.Body.Close(); err != nil {
        panic(err)
    }
    if err := json.Unmarshal(body, &tag); err != nil {
        response.Header().Set("Content-Type", "application/json; charset=UTF-8")
        response.WriteHeader(422) // unprocessable entity
        if err := json.NewEncoder(response).Encode(err); err != nil {
            panic(err)
        }
    }

    StoreTag(tag)
    response.Header().Set("Content-Type", "application/json; charset=UTF-8")
    response.WriteHeader(http.StatusCreated)
}

func postPersonHandler(response http.ResponseWriter, request *http.Request) {
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

func GetPersonByEmail(email string) Person {
  var persons []Person
  Execute(func(session redis.Conn) {
    persons, err := session.Do("GET", "persons")
    if err != nil {
      panic(err)
    }
  })
  return persons[SliceIndex(len(persons), func(i int) bool { return persons[i].Email == email })];
}


func SliceIndex(limit int, predicate func(i int) bool) int {
    for i := 0; i < limit; i++ {
        if predicate(i) {
            return i
        }
    }
    return -1
}

func GetAllTags() Tags {
  var tags Tags
  Execute(func(session redis.Conn) {
    tags, err := session.Do("GET", "tags")
    if err != nil {
      panic(err)
    }
  })
  return tags;
}

func StoreTag(tag Tag) {
  Execute(func(session redis.Conn) {
    _, err := session.DO("RPUSH", "tags", tag)
    if err != null {
        panic(err)
     }
  })
}

func GetAllPeople() Persons {
  var persons Persons
  Execute(func(session redis.Conn) {
    persons, err := session.Do("GET", "persons")
    if err != nil {
      panic(err)
    }
  })
  return persons
}

func StorePerson(person Person) {
  Execute(func(session redis.Conn) {
    _, err := session.Do("HSET", person.Email, person)
    if err != null {
        panic(err)
     }
  })
}

func Execute(fn func(session redis.Conn)) {
  session := GetSession();
  defer session.Close()
  fn(session);
}

//func GetSession() *mgo.Session {
//  session, err := mgo.Dial("localhost")
func GetSession() redis.Conn{
  session, err := redis.Dial("tcp", "redis:7379")
  if err != nil {
    panic(err)
  }
  return session;
}


func main() {
  r := mux.NewRouter()

  api := r.PathPrefix("/api").Subrouter()

  api.HandleFunc("/people/{email}", getPersonHandler).Methods("GET")
  api.HandleFunc("/people/{email}", deletePersonHandler).Methods("DELETE")

  api.HandleFunc("/people/", getPersonsHandler).Methods("GET")

  api.HandleFunc("/people/", postPersonHandler).Methods("POST")

  api.HandleFunc("/tags/", getTagsHandler).Methods("GET")
  api.HandleFunc("/tags/", postTagHandler).Methods("POST")

  r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/")))

  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":8080", nil))
}
