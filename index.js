const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');

// cors and express input 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri =process.env.MONGODB_DB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // node.js teke ei dui line nia aschi 
    const database = client.db("hireloop_db");
    const jobsCollection = database.collection("jobs");

    // api  a data post korbo 
    app.post('/jobs' , async( req, res) =>{
        const job = req.body;
        const result = await jobsCollection.insertOne(job)
        res.send(result)
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})