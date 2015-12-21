http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("localhost")
  if err != nil {
         panic(err)
  }
  defer session.Close()

  // Optional. Switch the session to a monotonic behavior.
  session.SetMode(mgo.Monotonic, true)

  c := session.DB("autocv").C("people")
  err = c.Insert(&Person{"Doopy Dorp", "Nice but dumb"},
           &Person{"Clara Cloora", "Retard"})
  if err != nil {
         log.Fatal(err)
  }

  result := Person{}
  err = c.Find(bson.M{"name": "Doopy Dorp"}).One(&result)
  if err != nil {
         log.Fatal(err)
  }
  fmt.Fprintf(w, "Name: %q", result.Name)
})
