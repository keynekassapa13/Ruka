// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ruka_off = Ruka_off;
exports.turn_led_on = turn_led_on;
exports.turn_led_off = turn_led_off;
exports.get_data_from_api = get_data_from_api;
/*
The code snippet below has been adapted from

Johhny Five for Arduino and Node JS
http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five

I have used and adapted the reference to make my own function.
*/

var RukaOn = 0;
$('.message').css('display', 'block');

function get_Ruka_isOn() {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/rukaOn',
    success: function success(dataResult) {
      if (dataResult["msg"] == true) {
        turn_led_off('red');
        turn_led_on('green');
        $('.message').fadeOut();
        setTimeout(function () {
          turn_led_off('green');
          turn_led_on('red');
        }, 2000);
        RukaOn = 1;
        clearInterval(RukaOnInterval);
      }
    }
  });
}

function Ruka_off() {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/rukaOff',
    success: function success(dataResult) {
      $('.m-content').text('Turning off Ruka');
      $('.message').fadeIn();
      setTimeout(function () {
        location.reload();
      }, 4000);
    }
  });
}

function turn_led_on(color) {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/' + color,
    success: function success(dataResult) {
      if (dataResult["msg"] == true) {}
    }
  });
}

function turn_led_off(color) {
  var feedback = $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/arduino/' + color + 'off',
    success: function success(dataResult) {
      if (dataResult["msg"] == true) {}
    }
  });
}

if (!RukaOn) {
  turn_led_on('red');
  var RukaOnInterval = setInterval(function () {
    get_Ruka_isOn();
  }, 1000);
}

function get_data_from_api(api_url, callback) {}
},{}]},{},[10], null)
//# sourceMappingURL=/main-index.53a4e8bc.map