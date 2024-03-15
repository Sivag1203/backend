import express from "express";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
const url =
  "mongodb+srv://sivaganeshnatarajavel:YA7ku2uZwCxmXyyx@cluster0.hlw8qs5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);
await client.connect();
console.log("Connected to Mongo");


app.get("/", (req, res) => {
  res.send("<h1>Vanakkam da mapla</h1>");
});

app.post("/post", express.json(), async (req, res) => {
  const getPost = req.body;
  const sendMethod = await client
    .db("CRUD")
    .collection("data")
    .insertOne(getPost);
  res.send(sendMethod);
});

app.post("/postmany", express.json(), async (req, res) => {
    const getPost = req.body;
    const sendMethod = await client
     .db("CRUD")
     .collection("data")
     .insertMany(getPost);
    res.send(sendMethod);
})

app.get("/get",express.json(), async(req,res)=>{
    const getMethod = await client
   .db("CRUD")
   .collection("data")
   .find({})
   .toArray();
    res.send(getMethod);
})

app.get("/getone/:id", async(req,res)=>{
    const {id} = req.params;
    const getMethod = await client.db("CRUD").collection("data").findOne({_id: new ObjectId(id)});
    res.send(getMethod);
})

app.put("/update/:id", express.json(), async(req,res)=>{
    const {id} = req.params;
    const getpost = req.body;
    const updateMethod = await client.db("CRUD").collection("data").updateOne({_id: new ObjectId(id)},{$set:{name:getpost.name}});
    res.send(updateMethod);
})

app.delete("/delete/:id", async(req,res)=>{
    const {id} = req.params;
    const deleteMethod = await client.db("CRUD").collection("data").deleteOne({_id: new ObjectId(id)});
    res.send(deleteMethod);
})

app.listen(8080, () => {
    console.log("listening on port 8080");
  });