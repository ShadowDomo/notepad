import express from 'express'
import { getFromDB, writetoDB, getValidKey } from './connection.js'

// POST TO DB
function writeData(req, res) {
  writetoDB(req.body)
  res.send(JSON.stringify('o'))
}


// GET FROM DB
async function getData(req, res) {
  const key = req.body.key
  const result = await getFromDB(key)
  if (!result) {
    res.send(JSON.stringify(''))
  } else {
    res.send(JSON.stringify(result))
  }
}

// Generates a valid save key
function generate(req, res) {
  const result = getValidKey()
  res.send(JSON.stringify(result))
}

function getRoutes(authKey) {
  const router = express.Router()

  router.get('/generate', generate)
  router.post('/get', getData)
  router.post('/', writeData)

  return router
}

export { getRoutes }