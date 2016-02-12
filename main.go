package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

//Skill is simply a skill a person can have in his field of expertise
type Skill struct {
	gorm.Model
	Name        string `sql:"unique"`
	Description string
}

//Person is an employee at beamon
type Person struct {
	gorm.Model
	Name           string
	Email          string `sql:"unique"`
	Info           string
	WantedSkills   []Skill `gorm:"many2many:user_wantedskills;"`
	TeachingSkills []Skill `gorm:"many2many:user_teachingskills;"`
}

func getPersonHandler(response http.ResponseWriter, request *http.Request) {
	//Get email from path
	vars := mux.Vars(request)
	email := vars["email"]

	person := getPersonByEmail(email)
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(response).Encode(person); err != nil {
		panic(err)
	}
}

func getPersonByEmail(email string) Person {
	person := Person{}

	execute(func(db *gorm.DB) {
		db.Preload("TeachingSkills").Preload("WantedSkills").Where("email = ?", email).Find(&person)
	})
	return person
}

func deletePersonHandler(response http.ResponseWriter, request *http.Request) {

	//Get id
	vars := mux.Vars(request)
	email := vars["email"]

	deletePersonByEmail(email)
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusOK)
}

func deletePersonByEmail(email string) {
	execute(func(db *gorm.DB) {
		db.Where("email = ?", email).Delete(&Person{})
	})
}

func getPersonsHandler(response http.ResponseWriter, request *http.Request) {
	persons := getAllPeople()
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(response).Encode(persons); err != nil {
		panic(err)
	}
}

func getAllPeople() []Person {
	var persons []Person
	execute(func(db *gorm.DB) {
		db.Preload("TeachingSkills").Preload("WantedSkills").Find(&persons)
	})
	return persons
}

func getSkillsHandler(response http.ResponseWriter, request *http.Request) {
	skills := getAllSkills()
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(response).Encode(skills); err != nil {
		panic(err)
	}
}

func getAllSkills() []Skill {
	var skills []Skill
	execute(func(db *gorm.DB) {
		db.Find(&skills)
	})
	return skills
}

func postSkillHandler(response http.ResponseWriter, request *http.Request) {
	var skill Skill
	body, err := ioutil.ReadAll(io.LimitReader(request.Body, 1048576))
	if err != nil {
		panic(err)
	}
	if err := request.Body.Close(); err != nil {
		panic(err)
	}
	if err := json.Unmarshal(body, &skill); err != nil {
		response.Header().Set("Content-Type", "application/json; charset=UTF-8")
		response.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(response).Encode(err); err != nil {
			panic(err)
		}
	}

	storeSkill(&skill)
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusCreated)
	json.NewEncoder(response).Encode(skill)
}

func storeSkill(skill *Skill) {
	execute(func(db *gorm.DB) {
		if db.NewRecord(skill) {
			db.Create(&skill)
		} else {
			db.Save(&skill)
		}
	})
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

	storePerson(&person)
	response.Header().Set("Content-Type", "application/json; charset=UTF-8")
	response.WriteHeader(http.StatusCreated)
	json.NewEncoder(response).Encode(person)
}

func storePerson(person *Person) {
	execute(func(db *gorm.DB) {
		if db.NewRecord(person) {
			db.Create(&person)
		} else {
			db.Save(&person)
		}
	})
}

func execute(fn func(db *gorm.DB)) {
	db := getDB()
	// defer db.Close()
	fn(db)
}

func getDB() *gorm.DB {
	db, err := gorm.Open("sqlite3", "autocv.db")
	if err != nil {
		panic(err)
	}
	db.LogMode(true)
	return &db
}

func initDb() {
	db := getDB()
	//Migrations etc.
	db.AutoMigrate(&Person{}, &Skill{})
}

func main() {
	initDb()

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/people/{email}", getPersonHandler).Methods("GET")
	api.HandleFunc("/people/{email}", deletePersonHandler).Methods("DELETE")

	api.HandleFunc("/people/", getPersonsHandler).Methods("GET")

	api.HandleFunc("/people/", postPersonHandler).Methods("POST")

	api.HandleFunc("/skills/", getSkillsHandler).Methods("GET")
	api.HandleFunc("/skills/", postSkillHandler).Methods("POST")

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/")))

	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
