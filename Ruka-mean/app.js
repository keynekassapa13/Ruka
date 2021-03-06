/*
The code snippet below has been adapted from

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();
const users = require('./routes/users');
const arduino = require('./routes/arduino');
const port = 3000;
const config = require('./config/database');

//Connect with database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ config.database);
})

//Database Error log
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+ err);
})

//CORS Middleware
app.use(cors());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Users Route
app.use('/users',users);

//Arduino Route
app.use('/arduino', arduino);

//Route
app.get('/test', (req, res) => {
  res.send('Testing Testing 3');
})

app.listen(port, () => {
  console.log('Server started on port '+ port);
})
