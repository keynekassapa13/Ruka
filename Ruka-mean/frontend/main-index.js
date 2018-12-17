/*
The code snippet below has been adapted from

Johhny Five for Arduino and Node JS
http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five

I have used and adapted the reference to make my own function.
*/

let RukaOn = 0;
$('.message').css('display', 'block');

function get_Ruka_isOn() {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/rukaOn',
    success: function(dataResult) {
    if (dataResult["msg"] == true) {
      turn_led_off('red');
      turn_led_on('green');
      $('.message').fadeOut();
      setTimeout( function() {
        turn_led_off('green');
        turn_led_on('red');
      },2000);
      RukaOn = 1;
      clearInterval(RukaOnInterval);
    }
  }
 })
}

export function Ruka_off() {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/rukaOff',
    success: function(dataResult) {
      $('.m-content').text('Turning off Ruka');
      $('.message').fadeIn();
      setTimeout(function() { location.reload()}, 4000);
  }
 })
}

export function turn_led_on(color){
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/'+color,
    success: function(dataResult) {
    if (dataResult["msg"] == true) {
    }
  }
 })
}

export function turn_led_off(color){
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/'+color+'off',
    success: function(dataResult) {
    if (dataResult["msg"] == true) {
    }
  }
 })
}

if (!RukaOn){
  turn_led_on('red');
  var RukaOnInterval = setInterval(
    function(){get_Ruka_isOn();}
    , 1000);
}

export function get_data_from_api(api_url, callback) {

}
