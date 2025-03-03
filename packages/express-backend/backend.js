import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema(
  {
    name: String,
    job: String,
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", async (req, res) => {
  const { name, job } = req.query;
  let filter = {};
  if (name) filter.name = name;
  if (job) filter.job = job;

  try {
    const users = await User.find(filter);
    res.json({ users_list: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});


app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});


app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});


app.delete("/users/:id", async (req, res) => { 
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
