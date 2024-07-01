var express = require('express');
var router = express.Router();

const fs = require("fs")

const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'mydb' // database name
const collectionName = 'test' // collection name

const turf = require("@turf/helpers")

// GET home page. 
router.get('/', function (req, res, next) {
  res.render('index');
});

// get file from form 
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('fileupload1'), (req, res) => {
  console.log("receiving data...")
  let uploadedFile = req.file
  let filename=req.file.originalname
  console.log("received: ", filename)
  let path=req.file.path
  fs.readFile(path, 'utf-8', function (err, data) {
    if (err) {
      console.log("cannot read file")
      res.render('index')
      throw err;
    }
    const content = data;
    //throws error if file isnt in .json format
    try{
      const dataJSON=JSON.parse(content)
      console.log("YourData:", dataJSON)
      save_data_to_db(dataJSON)
      console.log(filename+" added to Database: ",dataJSON)
      res.render('index')
      }
      catch(error){
        console.log("false fileformat")
        res.render('index')
      }
  });
})

async function save_data_to_db(data)
{
    
    console.log("Saving to database...")
    console.log(data)

    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)

    const collection = db.collection(collectionName)
    
    console.log("delete previous data from collection...")
    await collection.deleteMany() //clears database
    
    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true }
    const result = await collection.insertMany(data.features, options)
    console.log(`${result.insertedCount} documents were inserted in the collection`)
}

module.exports = router;
