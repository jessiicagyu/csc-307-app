import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};


const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

function generateId() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '1234567890';
  let id = '';

  for (let i = 0; i < 3; i++) {
    id += letters.charAt(Math.floor(Math.random()*letters.length));
  }
  for (let i = 0; i < 3; i++) {
    id += numbers.charAt(Math.floor(Math.random()*numbers.length));
  }
  return id;
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId();
  addUser(userToAdd);
  res.status(201).json(userToAdd);
});

const deleteUserById = (id) => {
  const user = users["users_list"].find((user) => user["id"] === id);
  if (user) {
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
    return true;
  } 
  return false;
}

app.delete("/users", (req, res) => {
  const id = req.query.id;
  if (id !== undefined) {
      const success = deleteUserById(id);
      if (success) {
        res.status(200).send("ID successfully deleted.");
      } else {
        res.status(404).send("ID not found.");
      }
  } else {
    res.status(400).send("ID required to delete user");
  }
})

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
}

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name && job) {
    const result = findUserByNameAndJob(name, job);
    res.send({users_list: result});
  } else if (name) {
    const result = findUserByName(name);
    res.send({users_list: result});
  } else {
    res.send(users);
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
