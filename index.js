const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT|| 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config() ;

//middlewear
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttkt4y5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const brandCollection = client.db("brandDB").collection("brand");

    const cartCollection = client.db("cartDB").collection("cart")



    app.get("/brandName", async ( req, res) =>{
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    }
    ); 

   

    app.get("/cartItem", async (req,res) =>{
       
        const cursor =  cartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    }) ;

    app.get("/cartItem/:id", async (req,res) =>{
      const query = {_id: new ObjectId(req.params.id)}
      const cursor = await brandCollection.findOne(query);
     
      res.send(cursor);
  });

  app.put('/updateBrand/:id', async (req, res) =>{
     const id = req.params.id ;
     const filter = {_id: new ObjectId(id)}
     const options = {upsert: true}
     const updateBrand = req.body 
     const brand = {
      $set : {
        name : updateBrand.name,
        brandName : updateBrand.brandName,
        type : updateBrand.type ,
        price : updateBrand.price ,
        image : updateBrand.image,
        rating : updateBrand.rating

      }
     } 

     const  result = await brandCollection.updateOne(filter, brand , options)
     res.send(result) 
  })

    app.delete('/cartItem/:id', async (req,res) =>{
      const id = req.params.id ;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })



    app.get("/addToCart/:id", async (req,res) =>{
        const query = {_id: new ObjectId(req.params.id)}
        const cursor = await brandCollection.findOne(query);
       
        res.send(cursor);
    });

    

    app.post('/addToCart', async (req, res) => {
        const selectedBrand = req.body;
        console.log(selectedBrand);
        const result = await cartCollection.insertOne(selectedBrand)
        res.send(result)
      
       
      });

    

    app.post ("/brandName", async(req, res) =>{
        const newBrand = req.body ;
        console.log(newBrand) ;
        const result = await brandCollection.insertOne(newBrand);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) =>{
    res.send("brand server is running succesfully")
});

app.listen(port, ()=>{
    console.log(`brand server is running on port ${port}`)
})