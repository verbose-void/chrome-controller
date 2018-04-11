var haveEvents = 'GamepadEvent' in window;
var controllers = {};

// define event names as they correspond to button names
let axisEventNames = ["leftanaloghorizontal", "leftanalogvertical", "rightanaloghorizontal", "rightanalogvertical"];
let buttonEventNames = ["abutton", "bbutton", "xbutton", "ybutton", "leftbumper", "rightbumper", "", "", "selectbutton", "startbutton", "leftanalogbutton", "rightanalogbutton", "dpadup", "dpaddown", "dpadleft", "dpadright", "homebutton"];

var rAF = window.mozRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler( e ) {
  controllers[e.gamepad.index] = e.gamepad;
  rAF( pollEvents );
  console.log( e.gamepad.id + " connected." );
}

function disconnecthandler( e ) {
  removegamepad( e.gamepad );
  console.log( e.gamepad.id + " disconnected." );
}

function removegamepad( gamepad ) {
  delete controllers[gamepad.index];
}

function pollEvents() {
  scangamepads();
  
  for( let k in controllers ) {
  // ************************* MUST BE FIRST ************************* //
  	let controller = controllers[k];

  	if ( !controller.previousAxes ) {
  		controller.previousAxes = [];
  	}

  	if ( !controller.previousPressedButtons ) {
  		controller.previousPressedButtons = [];
  	}

  	if ( !controller.previousLeftTrigger ) {
		controller.previousLeftTrigger = 0;
  		controller.previousRightTrigger = 0;
  	}
  	// **************************************************************** //

  	// Check for trigger usage
  	{
  		// Left Trigger
  		let value = controller.buttons[6].value;
  		if ( Math.abs( controller.previousLeftTrigger - value ) >= 0.005 ) {
  			let event;

  			if ( value >= 1 ) {
  				// Max Press
  				event = new CustomEvent( "lefttriggermaxpull", {
  					detail: {
	  					current: value,
	  					previous: controller.previousLeftTrigger,
			  			controller: controller
	  				} 
	  			} );
  			} else if ( value <= 0 ) {
  				// Release
  				event = new CustomEvent( "lefttriggerrelease", {
  					detail: {
	  					current: value,
	  					previous: controller.previousLeftTrigger,
			  			controller: controller
	  				} 
	  			} );
  			}

  			let pressure = new CustomEvent( "lefttriggerpressure", {
  				detail: {
	  				current: value,
	  				previous: controller.previousLeftTrigger,
			  		controller: controller
	  			} 
	  		} );

  			window.dispatchEvent( pressure );

  			if ( event ) {
  				window.dispatchEvent( event );
  			}
  		}

  		// Dispatch event every poll
  		let poll = new CustomEvent( "lefttriggerpoll", {
  				detail: {
	  				current: value,
	  				previous: controller.previousLeftTrigger,
			  		controller: controller
	  			} 
	  		} );

  		window.dispatchEvent( poll );
  	}

  	{
  		// Right Trigger
  		let value = controller.buttons[7].value;
  		if ( Math.abs( controller.previousRightTrigger - value ) >= 0.005 ) {
  			let event;

  			if ( value >= 1 ) {
  				// Max Press
  				event = new CustomEvent( "righttriggermaxpull", {
  					detail: {
	  					current: value,
	  					previous: controller.previousRightTrigger,
			  			controller: controller
	  				} 
	  			} );
  			} else if ( value <= 0 ) {
  				// Release
  				event = new CustomEvent( "righttriggerrelease", {
  					detail: {
	  					current: value,
	  					previous: controller.previousRightTrigger,
			  			controller: controller
	  				} 
	  			} );
  			}

  			let pressure = new CustomEvent( "righttriggerpressure", {
  				detail: {
	  				current: value,
	  				previous: controller.previousRightTrigger,
			  		controller: controller
	  			} 
	  		} );

  			window.dispatchEvent( pressure );

  			if ( event ) {
  				window.dispatchEvent( event );
  			}
  		}

  		// Dispatch event every poll
  		let poll = new CustomEvent( "righttriggerpoll", {
  				detail: {
	  				current: value,
	  				previous: controller.previousRightTrigger,
			  		controller: controller
	  			} 
	  		} );

  			
  		window.dispatchEvent( poll );
  	}
  	// ********************* //

  	// Check for button usage
  	for ( let i = 0; i < controller.buttons.length; i++ ) {
  		let eventName = buttonEventNames[i];

  		// Skip triggers
  		if ( eventName.length <= 0 ) {
  			continue;
  		}

		let event;

  		if ( controller.buttons[i].pressed && controller.previousPressedButtons[i] ) {
  			// dispatch hold
  			// TODO add hold duration
  			event = new CustomEvent( eventName + "hold", {
  				detail: {
		  			controller: controller
	  			} 
	  		} );
  		} else if ( !controller.buttons[i].pressed && controller.previousPressedButtons[i] ) {
  			// dispatch released
  			event = new CustomEvent( eventName + "released", {
  				detail: {
		  			controller: controller
	  			} 
	  		} );
  		} else if ( controller.buttons[i].pressed && !controller.previousPressedButtons[i] ) {
  			// dispatch pressed
  			event = new CustomEvent( eventName + "pressed", {
  				detail: {
		  			controller: controller
	  			} 
	  		} );
  		} else {
  			continue;
  		}
	  	
	  	window.dispatchEvent( event );
  	}
  	// ********************* //

  	// Check for analog stick movement
  	for ( let i = 0; i < controller.axes.length; i++ ) {
  		if ( Math.abs( controller.previousAxes[i] - controller.axes[i] ) >= 0.01 ) {
	  		let maxE;
	  		if ( controller.axes[i] >= 1 || controller.axes[i] <= -1 ) {
				maxE = new CustomEvent( axisEventNames[i] + "max", {
					detail: {
			  			previous: controller.previousAxes[i],
			  			current: controller.axes[i],
			  			controller: controller
	  				} 
	  			} );
	  		}

	  		let event = new CustomEvent( axisEventNames[i], {
				detail: {
			  		previous: controller.previousAxes[i],
			  		current: controller.axes[i],
			  		controller: controller
	  			} 
	  		} );

	  		if ( maxE ) {
	  			window.dispatchEvent( maxE );
	  		}
	  		window.dispatchEvent( event );
  		}

  		let poll = new CustomEvent( axisEventNames[i] + "poll", {
			detail: {
			  	previous: controller.previousAxes[i],
			  	current: controller.axes[i],
			  	controller: controller
	  		} 
	  	} );

	  	window.dispatchEvent( poll );
  	}
  	// ********************* //

  	// ************************* MUST BE LAST ************************* //
  	for ( let i = 0; i < controller.axes.length; i++ ) {
  		controller.previousAxes[i] = controller.axes[i];
  	}
  	for ( let i = 0; i < controller.buttons.length; i++ ) {
  		controller.previousPressedButtons[i] = controller.buttons[i].pressed;
  	}
  	controller.previousLeftTrigger = controller.buttons[6].value;
  	controller.previousRightTrigger = controller.buttons[7].value;
  	// **************************************************************** //
  }

  rAF( pollEvents );
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