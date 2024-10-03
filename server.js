//import our dependencies
const express = require ("express");
const dotenv= require('dotenv')
const mysql = require('mysql2')

const app = express()
dotenv.config()

//basic end point to say hello world
app.get(``,(req,res) => {
    res.send('Hello World!')
})

// start and listen to server

const PORT = 3000
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   })

   //create connection object
   const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
   })

   //test the connection
   db.connect((err) =>{
    //connection not successful
    if(err) {
      return console.log('Error connecting to MySQL', err)
    }
    //connection successful
    console.log("MYSQL connection successful")
   })

//get patients
app.get('/get-patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(query, (err, result) => {
      if (err) {
          return res.status(500).json(" Failed to fetch patients ")
      }
      //get back results
      res.status(200).json(results);
  });
});


// Get providers
app.get('/get-providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json("Failed to fetch providers");
    }
    // Get back results
    res.status(200).json(results);
  });
});

// Get patients by first name
app.get('/get-patients-by-name', (req, res) => {
  const { first_name } = req.query;

  if (!first_name) {
    return res.status(400).json("First name is required");
  }

  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
  db.query(query, [first_name], (err, results) => {
    if (err) {
      return res.status(500).json("Failed to fetch patients by name");
    }
    // Get back results
    res.status(200).json(results);
  });
});

// Get providers by speciality
app.get('/get-providers-by-speciality', (req, res) => {
  const { provider_speciality } = req.query;

  if (!provider_speciality) {
    return res.status(400).json("Provider speciality is required");
  }

  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_speciality = ?';
  
  db.query(query, [provider_speciality], (err, results) => {
    if (err) {
      return res.status(500).json("Failed to fetch providers by speciality");
    }
    // Get back results
    res.status(200).json(results);
  });
});

