const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.7n3bd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const allCampaigns = client.db("campaignsDB").collection("campaigns");
    const donatedCollection = client.db("campaignsDB").collection("donations");

    app.post("/donations", async (req, res) => {
      const myDonation = req.body;
      const result = await donatedCollection.insertOne(myDonation);
      res.send(result);
      console.log(result);
    });

    app.get("/donations", async (req, res) => {
      const result = await donatedCollection.find().toArray();
      res.send(result);
      console.log(result);
    });

    app.get("/campaigns", async (req, res) => {
      const result = await allCampaigns.find().toArray();
      res.send(result);
    });

    app.post("/campaigns", async (req, res) => {
      const newCampaign = req.body;
      const result = await allCampaigns.insertOne(newCampaign);
      res.send(result);
    });

    app.get("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCampaigns.findOne(query);
      res.send(result);
    });

    app.get("/myCampaign", async (req, res) => {
      const result = await allCampaigns.find().toArray();
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCampaigns.findOne(query);
      res.send(result);
    });
    app.delete("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCampaigns.deleteOne(query);
      res.send(result);
    });

    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;

      const update = {
        $set: {
          title: data.title,
          type: data.type,
          photo: data.photo,
          taka: data.taka,
          date: data.date,
          description: data.description,
        },
      };
      const result = await allCampaigns.updateOne(query, update);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on PORT: ${port}`);
});
