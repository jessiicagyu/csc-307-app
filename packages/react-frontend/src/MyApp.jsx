// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchUsers();
      }, []);

    function fetchUsers() {
        fetch("http://localhost:8000/users")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched users:", data.users_list);  
                if (data.users_list) {
                    setCharacters(data.users_list);
                }
            })
            .catch((error) => console.log("Error fetching users:", error));
    }

    function removeOneCharacter(_id) {
        fetch(`http://localhost:8000/users/${_id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 200) {
              setCharacters((prev) => prev.filter((user) => user._id !== _id));
            } else {
              console.log("Error deleting user");
            }
          })
          .catch((error) => console.log("Error deleting user:", error));
    }


    function updateList(person) {
        fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        })
          .then((res) => {
            if (res.status === 201) return res.json();
            else throw new Error("Failed to add user");
          })
          .then((newUser) => {
            setCharacters((prev) => [...prev, newUser]); // Add new user to state
          })
          .catch((error) => console.log("Error adding user:", error));
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