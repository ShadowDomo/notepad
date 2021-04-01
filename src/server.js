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

  console.log(accessToken)
}

// authorizeDB();

app.use(express.json())
app.use(cors())

// POST TO DB
app.post('/', async (req, res) => {
  writetoDB(req.body)
  res.send(JSON.stringify('o'))
  // res.send(JSON.stringify('hello world'))
})


// GET FROM DB
app.post('/get', async (req, res) => {
  authorizeDB()
  const key = req.body.key
  const result = await getFromDB(key)
  if (!result) {
    res.send(JSON.stringify(''))
  } else {
    res.send(JSON.stringify(result))
  }
  // console.log(result)
  // res.send(JSON.stringify('hello world'))
})

async function writetoDB(obj) {
  const key = obj.key
  const data = obj.data
  // console.table(value)
  const result = await fetch(`https://fitnessbackend-fad7d-default-rtdb.firebaseio.com/notepad/${key}.json?access_token=${accessToken}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  })
  // console.log(await result.json())
}


async function getFromDB(key) {
  const result = await fetch(`https://fitnessbackend-fad7d-default-rtdb.firebaseio.com/notepad/${key}.json?access_token=${accessToken}`)
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