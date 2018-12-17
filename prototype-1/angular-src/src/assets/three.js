$(document).ready( function() {

  $('.turnOff').hide();

var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(err0r) {
    console.log("Something went wrong!");
  });
}

$('#checkCamera').click(function(){
  $('#videoElement').toggle(this.checked);
});

function turnOff() {
  $('.turnOff-content').html('Turning off Ruka...');
  $('.turnOff').show();
  setTimeout(function() {
    window.location = "./";
  },2000);
};

//https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm

  'use strict';
var OBJECT_FILE = 'assets/try-3-main.js';
var OBJECT_FILE_TOP = 'assets/try-3-top.js';
var OBJECT_FILE_RED = 'assets/try-3-red.js';
var OBJECT_FILE_GREEN = 'assets/try-3-green.js';


$('#checkVariantTwo').click(function(){
  changeLED('assets/try-3-red-2.js','assets/try-3-green-2.js');
});

$('#checkVariantOne').click(function(){
  changeLED('assets/try-3-red.js','assets/try-3-green.js');
});

$('#checkVariantThree').click(function(){
  changeLED('assets/try-3-red-3.js','assets/try-3-green-3.js');
});

// https://github.com/satori99/threejs-blender-export

function changeLED(red_file, green_file){
  var selectedObject = scene.getObjectByName('red');
  scene.remove( selectedObject );
  selectedObject = scene.getObjectByName('green');
  scene.remove( selectedObject );

  OBJECT_FILE_RED = red_file;
  OBJECT_FILE_GREEN = green_file;

  turnGreen();
  turnRed();

  update();
}

var FOVY = 35
var renderer, needsUpdate;
var scene, grid, camera, directionalLight;
var gui, stats, app;
var on = 0;
init();
animate();
//

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.domElement.id = 'webgl-renderer';
  renderer.setClearColor( 0xffffff, 1 );
  renderer.setSize( window.innerWidth/2, window.innerHeight/2 );

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x2664af, 0.01 );
  new THREE.ObjectLoader().load( OBJECT_FILE, function ( object ) {
    object.traverse( function ( o ) {
      if ( o.type == "Mesh" && o.material && ! o.material.transparent ) {
        o.material.side = THREE.DoubleSide;
      }
    } );
    object.name = 'main';
    scene.add( object );
  } );

  new THREE.ObjectLoader().load( OBJECT_FILE_TOP, function ( object ) {
    object.traverse( function ( o ) {
      if ( o.type == "Mesh" && o.material && ! o.material.transparent ) {
        o.material.side = THREE.DoubleSide;
      }
    } );
    object.name = 'top';
    scene.add( object );
  } );
  turnRed();

  grid = new THREE.GridHelper( 8, 1 );
  grid.matrixAutoUpdate = false;
  grid.setColors( 0x2664af, 0x2664af );
  grid.material.transparent = true;
  grid.material.opacity = 0.85;
  scene.add( grid );
  // Lights
  directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
  directionalLight.position.set( -1, 1, -1 );
  directionalLight.position.setLength( 8 );
  scene.add( directionalLight );

  directionalLight.controls = new THREE.OrbitControls( directionalLight, renderer.domElement );
  directionalLight.controls.noZoom = true;
  directionalLight.controls.noPan = true;
  directionalLight.controls.noKeys = true;
  directionalLight.controls.enabled = false;
  directionalLight.controls.addEventListener( 'change', function() { needsUpdate = true; } );

  directionalLight.helper = new THREE.DirectionalLightHelper( directionalLight, 0.6 );
  //scene.add( directionalLight.helper );
  var hemiLight = new THREE.HemisphereLight( 0xccddff, 0x223322, 0.75 );
  hemiLight.position.copy( directionalLight.position );
  scene.add( hemiLight );
  hemiLight.helper = new THREE.HemisphereLightHelper( hemiLight, 1 );
  hemiLight.helper.children[ 0 ].material.fog = false;
  //scene.add( hemiLight.helper );
  var ambientLight = new THREE.AmbientLight( 0x202020 );
  scene.add( ambientLight );
  // Camera
  camera = new THREE.PerspectiveCamera( FOVY, window.innerWidth / window.innerHeight, 2, 2000 );
  camera.position.set( -8, 3, 5 );
  camera.controls = new THREE.OrbitControls( camera, renderer.domElement );
  camera.controls.minDistance = 3;
  camera.controls.maxDistance = 128;
  camera.controls.autoRotate = true;
  camera.controls.noKeys = true;
  camera.controls.addEventListener( 'change', function() { needsUpdate = true; } );
  camera.controls
  // UI
  stats = new Stats();
  //document.body.appendChild( stats.domElement );
  gui = new dat.GUI( { autoPlace: false, hideable: true, width: 300 } );
  gui.domElement.id = 'gui';
  //document.getElementById('test').appendChild( gui.domElement );
  app = {

    showGrid: gui.add( grid, 'visible').name( 'Show Grid' ).onChange( function() { needsUpdate = true; } ),

    rotateCamera: gui.add( camera.controls, 'autoRotate').name( 'Rotate Camera' )
  };
  // Events
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
  renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
  $('#test').append(renderer.domElement);
  //document.getElementById('test').appendChild(  );
}

function turnRed(){
  var selectedObject = scene.getObjectByName('green');
  scene.remove( selectedObject );
  new THREE.ObjectLoader().load( OBJECT_FILE_RED, function ( object ) {
    object.traverse( function ( o ) {
      if ( o.type == "Mesh" && o.material && ! o.material.transparent ) {
        o.material.side = THREE.DoubleSide;
      }
    } );
    object.name='red';
    scene.add( object );
  } );
  update();
}

function turnGreen(){
  var selectedObject = scene.getObjectByName('red');
  scene.remove( selectedObject );
  new THREE.ObjectLoader().load( OBJECT_FILE_GREEN, function ( object ) {
    object.traverse( function ( o ) {
      if ( o.type == "Mesh" && o.material && ! o.material.transparent ) {
        o.material.side = THREE.DoubleSide;
      }
    } );
    object.name='green';
    scene.add( object );
  } );
  update();
}

$('#gest-five').click(function(){
  if (on){
    turnRed();
    on = 0;
  } else {
    turnGreen();
    on = 1;
  }
});

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  camera.controls.update();
  // if ( needsUpdate === true ) {
  //   render();
  //   needsUpdate = false;
  // }
  render();
  stats.end();
}
function render() {
  renderer.render( scene, camera );
}

function update(){
  renderer.render( scene, null );
}
//

function onWindowResize( e ) {
  renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  needsUpdate = true;
}
function onKeyDown( e ) {

  switch ( e.keyCode ) {

  case 16: // Shift
    e.preventDefault();
    camera.controls.enabled = false;
    directionalLight.controls.enabled = true;
    break;

  case 71: // G - Toggle show grid
    e.preventDefault();
    app.showGrid.setValue( !app.showGrid.getValue() );
    break;

  case 82: // R - Toggle auto rotate
    e.preventDefault();
    app.rotateCamera.setValue( !app.rotateCamera.getValue() );
    break;
  //default:
  //	console.log( e.keyCode );
  }
}
function onKeyUp( e ) {

  switch ( e.keyCode ) {

  case 16: // Shift
    e.preventDefault();
    camera.controls.enabled = true;
    directionalLight.controls.enabled = false;
    break;
  }
}
function onMouseDown( e ) {
  if ( e.button === 0 && app.rotateCamera.getValue() === true ) {
    // disable camera autoRotate
    app.rotateCamera.setValue( false );
  }
  var mouseVector = new THREE.Vector3();
  mouseVector.x = 2 * (e.clientX / window.innerWidth * 2) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight * 2);
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera( mouseVector.clone(), camera );

  var clickedObj = scene.getObjectByName('top');
  var intersects = raycaster.intersectObject( clickedObj );
  for( var i = 0; i < intersects.length; i++ ) {
    var intersection = intersects[ i ],
    obj = intersection.object;
    intersects[0].object.material.color.setHex( 0x000000);
    turnOff();
  }
}
})
