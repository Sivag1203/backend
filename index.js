import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express()
const url ="mongodb+srv://sivaganeshnatarajavel:sivaganesh123@cluster0.hlw8qs5.mongodb.net";

const client = new MongoClient(url);
await client.connect();
console.log("Connected to Mongo");

const PORT = 5000;

app.use(express.json());
app.use(cors());


app.get("/", function (req, res) {
  res.send("Hello world");
});

app.post("/post", async (req, res) => {
  const getPost = req.body;
  const sendMethod = await client
    .db("CRUD")
    .collection("data")
    .insertOne(getPost);
  res.send(sendMethod);
});

app.post("/postmany", async (req, res) => {
  const getPost = req.body;
  const sendMethod = await client
    .db("CRUD")
    .collection("data")
    .insertMany(getPost);
  res.send(sendMethod);
});

app.get("/get", async (req, res) => {
  const getMethod = await client
    .db("CRUD")
    .collection("data")
    .find({})
    .toArray();
  res.send(getMethod);
});

app.get("/getone/:id", async (req, res) => {
  const { id } = req.params;
  const getMethod = await client
    .db("CRUD")
    .collection("data")
    .findOne({ _id: new ObjectId(id) });
  res.send(getMethod);
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const getpost = req.body;
  const updateMethod = await client
    .db("CRUD")
    .collection("data")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name: getpost.name } });
  res.send(updateMethod);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleteMethod = await client
    .db("CRUD")
    .collection("data")
    .deleteOne({ _id: new ObjectId(id) });
  res.send(deleteMethod);
});

app.listen(PORT || 4000, () => {
  console.log("listening on port 4000");
});
