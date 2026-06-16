const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const companyProfile = database.collection("companies");
    const userCollection = database.collection("user");


    app.get('/api/users', async( req,res)=>{
      const cursor = userCollection.find()
      const result1 = await cursor.toArray()
      console.log("object", result1);
      res.send(result1)
    })

    // details er id api 



app.get("/api/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await jobsCollection.findOne(query);
    console.log("object", result);
    res.send(result);
 
});
    
    // api  a data get korbo 
    app.get('/api/jobs' , async( req, res) =>{
      const query ={}
      if(req.query.companyId){
        query.companyId = req.query.companyId;
      }
      if(req.query.status){
        query.status = req.query.status
      }
      const cursor = jobsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    // api  a data post korbo 
    app.post('/api/jobs' , async( req, res) =>{
        const job = req.body;
        const newJob ={
          ...job,
          crearedAs: new Date ()
        }
        const result = await jobsCollection.insertOne(newJob)
        res.send(result)
    })


    app.get("/api/companies" ,async (req,res)=>{
      const companies = await companyProfile.find()
      const result = await companies.toArray()
      res.send(result)
    })


    // company data get korar api 
    app.get("/api/my/company", async (req, res)=>{
      const query = {};
      if(req.query.recruiterId){
        query.recruiterId = req.query.recruiterId;
      }
      const result = await companyProfile.findOne(query);
      res.send(result || {});
    })

    
    // company data past korar api 
    app.post("/api/company", async( req, res)=>{
      const company = req.body;
      const nreCompnay ={
        ...company,
        crearedAs: new Date()
      }
      const result = await companyProfile.insertOne(nreCompnay)
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