/** Handles authorization with firebase. */

const { google } = require('googleapis')
const dotenv = require('dotenv').config()

// Load the service account key JSON file.
var serviceAccount = require("../fitnessbackend-fad7d-950fefc60a6f.json");
serviceAccount['private_key'] = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

let accessToken;
async function authorizeDB(callback) {
  // Authenticate a JWT client with the service account.
  var jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    scopes
  );

  // Use the JWT client to generate an access token.
  jwtClient.authorize((error, tokens) => {
    if (error) {
      console.log("Error making request to generate access token:", error);
    } else if (tokens.access_token === null) {
      console.log("Provided service account does not have permission to generate access tokens");
    } else {
      accessToken = tokens.access_token;
      // console.log(accessToken)
      callback(accessToken)
    }
  });
}

export { authorizeDB }