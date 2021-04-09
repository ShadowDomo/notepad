/** Entry point into program. */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { authorizeDB } from './authorization.js'
import { start } from './server.js'

// Setup db 
authorizeDB(start)




