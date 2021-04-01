const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const { google } = require('googleapis')
const fetch = require('node-fetch')


// Load the service account key JSON file.
var serviceAccount = require("../fitnessbackend-fad7d-950fefc60a6f.json");

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

let accessToken;
function authorizeDB() {
  // Authenticate a JWT client with the service account.
  var jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    scopes
  );


  // Use the JWT client to generate an access token.
  jwtClient.authorize(function (error, tokens) {
    if (error) {
      console.log("Error making request to generate access token:", error);
    } else if (tokens.access_token === null) {
      console.log("Provided service account does not have permission to generate access tokens");
    } else {
      accessToken = tokens.access_token;
    }
  });
}

authorizeDB();

app.use(express.json())
app.use(cors())

app.post('/', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify('ok'))
  // res.send(JSON.stringify('hello world'))
})

app.post('/get', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify('ok'))
  // res.send(JSON.stringify('hello world'))
})

// // Gets the exercises for the given workout key
// app.get('/get/:key', async (req, res) => {
//   try {
//     const result = await getFromDB(req.params.key)
//     if (result === null) {
//       res.send(JSON.stringify({ error: 'error' }));
//     } else {
//       res.send(result)
//       console.log(result)
//     }
//   } catch (error) {
//     authorizeDB()
//   }
// })


async function writetoDB(value) {
  let parsed = JSON.parse(value)
  const key = parsed.key
  const exercises = parsed.exercises;
  // console.table(value)
  const result = await fetch(`https://fitnessbackend-fad7d-default-rtdb.firebaseio.com/test/${key}.json?access_token=${accessToken}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(exercises)
  })
  console.log(await result.json())
}


async function getFromDB(key) {
  const result = await fetch(`https://fitnessbackend-fad7d-default-rtdb.firebaseio.com/test/${key}.json?access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body: JSON.stringify(test)
  })
  return await result.json()
}

// app.post('/', (req, res) => {
//   res.send('gg')
//   writetoDB(JSON.stringify(req.body))
//   // res.send(JSON.stringify(req.body))
//   // console.log(JSON.stringify(req.body))
// })

app.listen(port, () => {
  console.log('listening on 3001')

})