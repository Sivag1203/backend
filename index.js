import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { get } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const url =
  "mongodb+srv://sivaganeshnatarajavel:sivaganesh123@cluster0.hlw8qs5.mongodb.net";

const client = new MongoClient(url);
await client.connect();
console.log("Connected to Mongo");

const PORT = 4000;

app.use(express.json());
app.use(cors());

const auth = (req, res, next) => {
  try {
    const token = req.headers("backend-token");
    jwt.verify(token, "student");
    next();
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

app.get("/", function (req, res) {
  res.status(200).send("Hello world");
});

app.post("/post", async (req, res) => {
  const getPost = req.body;

  const sendMethod = await client
    .db("CRUD")
    .collection("data")
    .insertOne(getPost);
  res.status(201).send(sendMethod);
});

app.post("/postmany", async (req, res) => {
  const getPost = req.body;
  const sendMethod = await client
    .db("CRUD")
    .collection("data")
    .insertMany(getPost);
  res.status(201).send(sendMethod);
});

app.get("/get",auth, async (req, res) => {
  const getMethod = await client
    .db("CRUD")
    .collection("data")
    .find({})
    .toArray();
  res.status(200).send(getMethod);
});

app.get("/getone/:id", async (req, res) => {
  const { id } = req.params;
  const getMethod = await client
    .db("CRUD")
    .collection("data")
    .findOne({ _id: new ObjectId(id) });
  res.status(200).send(getMethod);
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const getpost = req.body;
  const updateMethod = await client
    .db("CRUD")
    .collection("data")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name: getpost.name } });
  res.status(201).send(updateMethod);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleteMethod = await client
    .db("CRUD")
    .collection("data")
    .deleteOne({ _id: new ObjectId(id) });
  res.status(200).send(deleteMethod);
});

app.post("/register", async function (req, res) {
  const { username, password, email } = req.body;
  const userfind = await client
    .db("CRUD")
    .collection("private")
    .findOne({ email: email });

  if (userfind) {
    res.status(400).send("User already exists");
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);
    const regmeth = await client
      .db("CRUD")
      .collection("private")
      .insertOne({ username: username, password: hashpass, email: email });
    res.status(201).send(regmeth);
    // console.log(hashpass);
  }

  // console.log(userfind);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userfind = await client
    .db("CRUD")
    .collection("private")
    .findOne({ email: email });
  if (userfind) {
    const mongodbpassword = userfind.password;
    const passwordchk = await bcrypt.compare(password, mongodbpassword);
    if (passwordchk === true) {
      const token = jwt.sign({ id: userfind._id }, "student");
      res.status(200).send({ token: token });
    } else {
      res.status(400).send("Invalid password");
    }
    // res.status(200);
  } else {
    res.status(400).send(`User not found`);
  }
  // const salt = await bcrypt.genSalt(10);
  // const hashpass = await bcrypt.hash(password, salt);
  // console.log({ email, hashpass });
});
app.listen(PORT || 4000, () => {
  console.log("listening on port 4000");
});
