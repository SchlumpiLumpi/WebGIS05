const express = require('express')
const app = express()
const path = require('path')
const port = 5000


app.use(express.static(path.join(__dirname, '/public')))

//include MongoDb
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'mydb' // database name
const collectionName = 'test' // collection name
html_home_file = path.join(__dirname,'/public','home.html')

//start on home page
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  console.log(html_home_file)
  res.sendFile(html_home_file)
  })

  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: false }));

//manages user input
app.post('/',(req,res) => {
  console.log("receiving data...")
  try{
  const data=JSON.parse(req.body.json_input)
  console.log("YourData:", data)
  save_data_to_db(data)
  console.log("uploaded file",data)
  res.sendFile(html_home_file)
  }
  catch(error){
    console.log("false fileformat")
    res.sendFile(html_home_file)
  }
  
})
  
var impressum_route = require('./routes/impressum')

app.use('/impressum', impressum_route)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



async function save_data_to_db(data)
{
    console.log("Saving to database...")
    console.log(data)

    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)

    const collection = db.collection(collectionName)

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true }
    const result = await collection.insertMany(data.features, options)
    console.log(`${result.insertedCount} documents were inserted in the collection`)
}