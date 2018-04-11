var haveEvents = 'GamepadEvent' in window;
var controllers = {};

var rAF = window.mozRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler( e ) {
  controllers[e.gamepad.index] = e.gamepad;
  rAF( updateStatus );
  console.log( e.gamepad.id + " connected." );
}

function disconnecthandler( e ) {
  removegamepad( e.gamepad );
  console.log( e.gamepad.id + " disconnected." );
}

function removegamepad( gamepad ) {
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  
  for( let k in controllers ) {
  	let controller = controllers[k];
  	handleRightThumbstick( controller.axes[2], controller.axes[3], controller );
  }

  rAF( updateStatus );
}

function scangamepads() {
  var gamepads = navigator.getGamepads();
  for ( var i = 0; i < gamepads.length; i++ ) {
    if ( gamepads[i] ) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

if ( haveEvents ) {
  window.addEventListener( "gamepadconnected", connecthandler );
  window.addEventListener( "gamepaddisconnected", disconnecthandler );
} else {
  setInterval( scangamepads, 500 );
}