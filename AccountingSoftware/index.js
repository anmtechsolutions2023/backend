const express = require('express')
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require('cors')

const session = require('express-session')
var memoryStore = new session.MemoryStore()

const app = express()

var corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

app.use(cors(corsOptions))

// app.use(session({ secret: 'some secret', resave: false, saveUninitialized: true, store: memoryStore }));

app.use(
  session({
    secret: '356b713d-3e57-4310-b08a-93493a0934f1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
)
const keycloak = require('./app/config/keycloak-config').initKeycloak(
  memoryStore
)

// const keycloak = require('./app/config/keycloak-config').initKeycloak(memoryStore);
app.use(keycloak.middleware())
app.use(keycloak.middleware({ logout: '/logout' }))

// function s(memoryStore) { if (_keycloak) { console.warn("Trying to init Keycloak again!"); return _keycloak; } else { console.log("Initializing Keycloak..."); _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig); return _keycloak; } }

// parse requests of content-type - application/json
app.use(express.json()) /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
) /* bodyParser.urlencoded() is deprecated */

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our application.' })
})

// require('./app/routes/api.routes.js')(app)

require('./app/routes/api.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
