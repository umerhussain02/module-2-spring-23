const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database Config..
const uri =
  "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.vt4w9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

const connectDb = async () => {
  try {
    await client.connect();
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("Not Connected");
  }
};
// Database Config End
// Create
app.post("/add", async (req, res) => {
  const collection = client.db("list").collection("users");
  await collection.insertOne(req.body);
  const users = await collection.find().toArray();
  res.send(users);
});

// Read
app.get("/users", async (req, res) => {
  const collection = client.db("list").collection("users");
  const users = await collection.find().toArray();
  res.send(users);
});

// Update
app.put("/update/:id", async (req, res) => {
  const getId = req.params.id;
  const collection = client.db("list").collection("users");
  const updatedName = { $set: req.body };
  const Id = { _id: new ObjectId(getId) };
  await collection.findOneAndUpdate(Id, updatedName);

  const users = await collection.find().toArray();
  res.send(users);
});
// Delete
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const collection = client.db("list").collection("users");

  await collection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  const users = await collection.find().toArray();
  res.send(users);
});

// Server Config...
app.listen(port, () => {
  console.log(`Server is running on http://locathost:${port}`);
  connectDb();
});
