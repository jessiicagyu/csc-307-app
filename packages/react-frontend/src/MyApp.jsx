// src/MyApp.jsx
import Table from "./Table";
import Form from "./Form";
import React, { useState, useEffect } from "react";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(person)
        });
      
        return promise;
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
          .then((res) => res.json())
          .then((json) => setCharacters(json["users_list"]))
          .catch((error) => {
            console.log(error);
          });
      }, []);

    function updateList(person) {
        postUser(person)
            .then(response => {
                if (response.status === 201) {
                    response.json().then(updatedPerson => {
                        setCharacters([...characters, updatedPerson]);
                    })
                }
                else {
                    console.log(response.status);
                }
            })
          .catch((error) => {
            console.log(error);
          });
    }

    function removeOneCharacter(index) {
        const updated = characters.filter((character, i) => {
        return i !== index;
        });
        setCharacters(updated);
    }


    return (
        <div className="container">
        <Table
            characterData={characters}
            removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList}/>
        </div>
    );
}
  
export default MyApp;