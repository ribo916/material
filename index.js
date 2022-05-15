const express = require('express') // Support web apps with NODEJS
const axios = require('axios') // Promise based HTTP client
const app = express()
const port = 3000
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const { exit } = require("process");
const open = require("open");
const bodyParser = require('body-parser');

// ***********************************************
// Prepare Express
// ***********************************************

// Support CORS so browsers can interact with us cross domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Configure and Launch the Express Server
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.text({ type: 'text/plain' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public')); // load files from public directory
app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});

// ***********************************************
// Endpoints
// ***********************************************

app.get('/', function(req, res) {
  res.sendFile('public/index.html'); // no need to specify dir off root
});
