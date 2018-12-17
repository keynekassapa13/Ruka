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

 Node JS Configuration
 https://www.youtube.com/watch?v=uONz0lEWft0&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ

 I have used their reference to make my own function. The function here is connected to the node js server.
 */

import * as tf from '@tensorflow/tfjs';
import * as main from './main-index';

const CONTROLS = ['one', 'two', 'three', 'four', 'five'];
let TEMP = {};
let TEMPRESULT = [];
let flagPush = false;

export function init() {
  document.getElementById('controller').style.display = '';
  statusElement.style.display = 'none';
}

const trainStatusElement = document.getElementById('train-status');

// Set hyper params from UI values.
const learningRateElement = document.getElementById('learningRate');
export const getLearningRate = () => +learningRateElement.value;

const batchSizeFractionElement = document.getElementById('batchSizeFraction');
export const getBatchSizeFraction = () => +batchSizeFractionElement.value;

const epochsElement = document.getElementById('epochs');
export const getEpochs = () => +epochsElement.value;

const denseUnitsElement = document.getElementById('dense-units');
export const getDenseUnits = () => +denseUnitsElement.value;
const statusElement = document.getElementById('status');

export function startPacman() {
  // google.pacman.startGameplay();
}

export function FlagPushOn() {
  flagPush = !flagPush;
  if (flagPush == 1){
    main.turn_led_on('green');
    main.turn_led_off('red');
  }
  return TEMP
}

export function FlagPushOff() {
  flagPush = false;
  main.turn_led_on('red');
  main.turn_led_off('green');
}

export function getMaxAndmakeTempNull() {
  delete TEMP["five"];
  console.log(TEMP);
  var arr = Object.keys( TEMP ).map(function ( key ) { return TEMP[key]; });
  var max = Math.max.apply(null,arr);
  var maxkey = Object.keys(TEMP).filter(function(x){ return TEMP[x] == max; })[0];
  return maxkey
}

export function setTempNull() {
  TEMP = {};
}

export function predictClass(classId) {
  if (flagPush) {
    console.log('saving');
    if (TEMP[CONTROLS[classId]] != undefined) {
        TEMP[CONTROLS[classId]] = TEMP[CONTROLS[classId]] + 1;
    } else {
        TEMP[CONTROLS[classId]] = 1;
    }
  }
  document.body.setAttribute('data-active', CONTROLS[classId]);
}

export function isPredicting() {
  statusElement.style.visibility = 'visible';
}
export function donePredicting() {
  statusElement.style.visibility = 'hidden';
}
export function trainStatus(status) {
  trainStatusElement.innerText = status;
}

export let addExampleHandler;
export function setExampleHandler(handler) {
  addExampleHandler = handler;
}
let mouseDown = false;
const totals = [0, 0, 0, 0, 0];

const oneButton = document.getElementById('one');
const fourButton = document.getElementById('four');
const twoButton = document.getElementById('two');
const threeButton = document.getElementById('three');
const startButton = document.getElementById('five');

const thumbDisplayed = {};

async function handler(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');
  while (mouseDown) {
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

oneButton.addEventListener('mousedown', () => handler(0));
oneButton.addEventListener('mouseup', () => mouseDown = false);

fourButton.addEventListener('mousedown', () => handler(3));
fourButton.addEventListener('mouseup', () => mouseDown = false);

twoButton.addEventListener('mousedown', () => handler(1));
twoButton.addEventListener('mouseup', () => mouseDown = false);

threeButton.addEventListener('mousedown', () => handler(2));
threeButton.addEventListener('mouseup', () => mouseDown = false);

startButton.addEventListener('mousedown', () => handler(4));
startButton.addEventListener('mouseup', () => mouseDown = false);

export function drawThumb(img, label) {
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    draw(img, thumbCanvas);
  }
}

export function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}
