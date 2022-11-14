const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v1tebzj.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
  try{
const serviceCollection = client.db('genius-car').collection('services');

const orderCollection = client.db('genius-car').collection('order');

//services

app.get('/services', async (req, res) => {
  const query = {}
  const cursor = serviceCollection.find(query);
  const services = await cursor.toArray();
  res.send(services);
});

//service id
app.get('/services/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:ObjectId(id)};
  const service = await serviceCollection.findOne(query);
  res.send(service);
})


//orders post

app.post('/orders',async(req,res)=>{
const order =req.body;
const result = await orderCollection.insertOne(order);
res.send(result);
});

//orders get

app.get('/orders',async(req,res)=>{

let query = {};

if(req.query.email){
  query = {
       email:req.query.email
  }
}

  const cursor = orderCollection.find(query);
  const orders = await cursor.toArray();
  res.send(orders);

})


app.patch('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.status
  const query = { _id: ObjectId(id) }
  const updatedDoc = {
      $set:{
          status: status
      }
  }
  const result = await orderCollection.updateOne(query, updatedDoc);
  res.send(result);
})

//delete order
app.delete('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await orderCollection.deleteOne(query);
  res.send(result);
})

//update

app.patch('/orders/:id', async(req,res)=>{
const id = req.params.id;
const status = req.body.status;
const query = {_id: ObjectId(id)};
const updatedDoc ={
  $set:{
    status:status
  }
 
}
const result = await orderCollection.updateOne(query,updatedDoc);
res.send(result);


})




  }
  finally{

  }

}



run().catch(err => console.err(err))


app.get('/', (req, res) => {
    res.send('genius car server is running')
})

app.listen(port, () => {
    console.log(`Genius Car server running on ${port}`);
})