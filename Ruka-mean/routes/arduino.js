/*
The code snippet below has been adapted from

Johhny Five for Arduino and Node JS
http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five

Node JS Configuration
https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

I have used their reference to make my own function. The function here is connected to the node js server.
*/


var five = require("johnny-five");
var board = new five.Board();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

board.on("ready", function() {

  var green = new five.Led(13);
  var red = new five.Led(12);

  var button = new five.Button(2);

  board.repl.inject({
    button: button
  });

  var rukaIsOn = false;

  button.on("down", function() {
    rukaIsOn = !rukaIsOn;
    console.log("status: " + rukaIsOn);
  });

  router.get('/rukaOn', (req, res, next) => {
    console.log('ARDUINO LISTENER.. RUKA ON/OFF');
    return res.json({success: true, msg: rukaIsOn})
  })

  router.get('/rukaOff', (req, res, next) => {
    console.log('ARDUINO LISTENER.. RUKA ON/OFF');
    rukaIsOn = false;
    return res.json({success: true, msg: 'Ruka is off'})
  })

  router.get('/green', (req, res, next) => {
    console.log('ARDUINO LISTENER.. GREEN BLINK');
    green.on();

    return res.json({success: true, msg: 'blink'});
  })

  router.get('/greenoff', (req, res, next) => {
    console.log('ARDUINO LISTENER.. GREEN OFF');
    green.off();

    return res.json({success: true, msg: 'off'});
  })

  router.get('/red', (req, res, next) => {
    console.log('ARDUINO LISTENER.. RED BLINK');
    red.on();

    return res.json({success: true, msg: 'blink'});
  })

  router.get('/redoff', (req, res, next) => {
    console.log('ARDUINO LISTENER.. RED OFF');
    red.off();


    return res.json({success: true, msg: 'off'});
  })

});

// End code snippet (2. output loop)

module.exports = router;
