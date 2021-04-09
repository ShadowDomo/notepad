/** Handles connections to db. */
import fetch from 'node-fetch'
import { generateRandomKey } from './util.js'
import { authKey as accessToken } from './server.js'

async function writetoDB(obj) {
  const key = obj.key
  const data = obj.data
  // console.table(value)
  await fetch(`https://fitnessbackend-fad7d-default-rtdb.firebaseio.com/notepad/${key}.json?access_token=${accessToken}`, {
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



// checks if key is valid
async function checkNewKey(key) {
  const result = await getFromDB(key)
  return !result
}

// gets a clean key
function getValidKey() {
  const keyLength = 5
  let key = generateRandomKey(keyLength)

  // generate legal key
  while (!checkNewKey(key)) {
    key = generateRandomKey(keyLength)
  }
  return key
}

export { getFromDB, writetoDB, getValidKey }