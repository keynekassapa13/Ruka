/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

 /*
 The code snippet below has been adapted from

 TenserFlow Guide
 https://github.com/tensorflow/tfjs-examples

 I have used and adapted the reference to make my own function. The function here is for the machine learning.
 */


import * as tf from '@tensorflow/tfjs';

import {ControllerDataset} from './controller_dataset';
import * as ui from './ui';
import {Webcam} from './webcam';
import * as main from './main-index';

let STEPS = [0,0,0];
let RukaOn = 0;
let FlagEnd = 0;

// The number of classes we want to predict. In this example, we will be
// predicting 4 classes for up, down, left, and right.
const NUM_CLASSES = 5;

// A webcam class that generates Tensors from the images from the webcam.
const webcam = new Webcam(document.getElementById('webcam'));

// The dataset object where we will store activations.
const controllerDataset = new ControllerDataset(NUM_CLASSES);

let mobilenet;
let model;

// Loads mobilenet and returns a model that returns the internal activation
// we'll use as input to our classifier model.
async function loadMobilenet() {
  const mobilenet = await tf.loadModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  // Return a model that outputs an internal activation.
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

// When the UI buttons are pressed, read a frame from the webcam and associate
// it with the class label given by the button. up, down, left, right are
// labels 0, 1, 2, 3 respectively.
ui.setExampleHandler(label => {
  tf.tidy(() => {
    const img = webcam.capture();
    controllerDataset.addExample(mobilenet.predict(img), label);

    // Draw the preview thumbnail.
    ui.drawThumb(img, label);
  });
});

/**
 * Sets up and trains the classifier.
 */
async function train() {
  if (controllerDataset.xs == null) {
    changeText('Add some examples before training!');
    throw new Error('Add some examples before training!');
  }

  // Creates a 2-layer fully connected model. By creating a separate model,
  // rather than adding layers to the mobilenet model, we "freeze" the weights
  // of the mobilenet model, and only train weights from the new model.
  model = tf.sequential({
    layers: [
      // Flattens the input to a vector so we can use it in a dense layer. While
      // technically a layer, this only performs a reshape (and has no training
      // parameters).
      tf.layers.flatten({inputShape: [7, 7, 256]}),
      // Layer 1
      tf.layers.dense({
        units: ui.getDenseUnits(),
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      // Layer 2. The number of units of the last layer should correspond
      // to the number of classes we want to predict.
      tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });

  // Creates the optimizers which drives training of the model.
  const optimizer = tf.train.adam(ui.getLearningRate());
  // We use categoricalCrossentropy which is the loss function we use for
  // categorical classification which measures the error between our predicted
  // probability distribution over classes (probability that an input is of each
  // class), versus the label (100% probability in the true class)>
  model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

  // We parameterize batch size as a fraction of the entire dataset because the
  // number of examples that are collected depends on how many examples the user
  // collects. This allows us to have a flexible batch size.
  const batchSize =
      Math.floor(controllerDataset.xs.shape[0] * ui.getBatchSizeFraction());
  if (!(batchSize > 0)) {
    throw new Error(
        `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
  }

  // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: ui.getEpochs(),
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        ui.trainStatus('Loss: ' + logs.loss.toFixed(5));
      }
    }
  });
}

let isPredicting = false;

function changeText(mess) {
  fadeOutContent();
  setTimeout( function() {
    $('.content').html(mess);
    fadeInContent();
  }, 600)
}

function fadeOutContent() {
  var $desktopContent = $('.content');
  var tl = new TimelineMax();
  tl
  .fromTo($desktopContent, 0.3, {opacity: 1}, {opacity:0, ease: Power2.easeOut})
}

function fadeInContent() {
  var $desktopContent = $('.content');
  var tl = new TimelineMax();
  tl
  .fromTo($desktopContent, 0.3, {opacity: 0}, {opacity:1, ease: Power2.easeOut})
}

function demand(firstGesture, secondGesture){
  if (firstGesture == "one"){
    if (secondGesture == "one"){
      changeText("Your command is " + "Turning off your room lamp now!");
    } else if (secondGesture == "two"){
      changeText("Your command is " + "Turning on your dishwasher!");
    } else if (secondGesture == "three"){
      changeText("Your command is " + "Turning on the TV!");
    } else if (secondGesture == "four"){

    }

  } else if (firstGesture == "two"){
    if (secondGesture == "one"){
      $.ajax({
        type: 'GET',
        url: 'https://newsapi.org/v2/top-headlines?country=au&category=entertainment&apiKey=a1d3907ce1524559ad86b9cbf4177abf',
        success: function(dataResult) {
          changeText('Here is the news for you: <br/>' + dataResult['articles'][0]['title'] + ', from ' + dataResult['articles'][0]['source']['name']);
        }
      });

    } else if (secondGesture == "two"){

      $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?q=Brisbane&APPID=bfc18954f0506b5d82f6ca103e7c4a35',
        success: function(dataResult) {
          changeText('Here is the weather for today: <br/>' + dataResult['name'] + ', ' + dataResult['weather'][0]['main'] + ', ' + dataResult['weather'][0]['description']);
        }
      });

    } else if (secondGesture == "three"){

    } else if (secondGesture == "four"){

    }

  } else if (firstGesture == "three"){
    if (secondGesture == "one"){

    } else if (secondGesture == "two"){

    } else if (secondGesture == "three"){

    } else if (secondGesture == "four"){

    }

  } else if (firstGesture == "four"){
    if (secondGesture == "one"){

    } else if (secondGesture == "two"){

    } else if (secondGesture == "three"){

    } else if (secondGesture == "four"){

    }

  }
}

async function predict() {
  ui.isPredicting();
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      // Capture the frame from the webcam.
      const img = webcam.capture();

      // Make a prediction through mobilenet, getting the internal activation of
      // the mobilenet model.
      const activation = mobilenet.predict(img);

      // Make a prediction through our newly-trained model using the activation
      // from mobilenet as input.
      const predictions = model.predict(activation);

      // Returns the index with the maximum probability. This number corresponds
      // to the class the model thinks is the most probable given the input.
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();

    ui.predictClass(classId);

    if (RukaOn == 0 && classId == 4 && STEPS[0] == 0){
      console.log('first step, STEPS = ' + STEPS);
      // Ruka turn on & First gesture analyzed
      changeText('Hi There, Welcome to Ruka!');
      STEPS[0] = 1;

      setTimeout( function() {
        changeText("Let's start analyzing your hand gesture now!");
      }, 2000);

      setTimeout( function () {
        STEPS[1] = 2;
        RukaOn = !RukaOn;
        testing(0);
      }, 4000);

    }

    if (RukaOn && (STEPS[0] != 0 && STEPS[0] != 1) && STEPS[1] == 2) {
      console.log('second step, STEPS = ' + STEPS);

      STEPS[1] = 1;

      setTimeout( function() {
        changeText("Great! Get ready for us to analyze your second hand gesture now!");
      }, 2000);

      setTimeout(function() {
        // Second Gesture Analyzed
        changeText("Analyzing your second hand gesture now!");
        ui.setTempNull();
        testing(1);
      }, 2000);

    }

    if (RukaOn && (STEPS[1] != 0 && STEPS[1] != 1 && STEPS[1] != 2) && (STEPS[0] != 0  && STEPS[0] != 1) && STEPS[2] == 0) {
      STEPS[2] = 1;
      console.log('final step, STEPS = ' + STEPS);

      // the end of the gesture journey
      changeText("Please wait for a moment...");
      setTimeout(function() {
        demand(STEPS[0], STEPS[1]);
        RukaOn = 0;
        STEPS = [0,0,0];
        ui.setTempNull();
        ui.FlagPushOff();

        FlagEnd = 0;
      }, 3000);

    }
    await tf.nextFrame();
  }
  ui.donePredicting();
}

document.getElementById('train').addEventListener('click', async () => {
  ui.trainStatus('Training...');
  await tf.nextFrame();
  await tf.nextFrame();
  isPredicting = false;
  train();
});

document.getElementById('predict').addEventListener('click', () => {
  ui.startPacman();
  isPredicting = true;

  predict();
});

function testing(indicator) {
  console.log('masuk indicator '+ indicator);
  ui.FlagPushOn();
  let nowDatetime = new Date();
  let newDatetime = nowDatetime.setSeconds(nowDatetime.getSeconds() + 5);
  $("#limit").countdown(newDatetime, function(event) {
    console.log('change');
    $(this).text(event.strftime('Timer: %M:%S'));
  }).on('finish.countdown', function(event) {

    let result = ui.FlagPushOff();
    let result2 = ui.getMaxAndmakeTempNull();

    if (STEPS[indicator] == 1){
      console.log('Debug 1: STEPS = ' + STEPS + ', indicator = ' + indicator);
      STEPS[indicator] = result2;
      console.log('Debug 2: STEPS = ' + STEPS + ', indicator = ' + indicator);
    }

  });
}

$('#stop').click(function() {
  isPredicting = false;
  main.Ruka_off();
})

async function init() {
  try {
    await webcam.setup();
  } catch (e) {
    document.getElementById('no-webcam').style.display = 'block';
  }
  mobilenet = await loadMobilenet();

  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the first time we collect data from the webcam it will be
  // quick.
  tf.tidy(() => mobilenet.predict(webcam.capture()));

  ui.init();
}

// Initialize the application.
init();
