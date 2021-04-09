import express from 'express'
import cors from 'cors'
import { getRoutes } from './routes.js'

const app = express()

let PORT = process.env.PORT
if (PORT == null || PORT == "") {
  PORT = 3001
}

app.use(express.json())
app.use(cors())

let authKey;
// only run after authentication works
function start(auth) {
  authKey = auth;
  console.log(auth)

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  })

  app.use('/', getRoutes(authKey))
}

export { start, authKey }