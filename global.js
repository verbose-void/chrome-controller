/*
 *	Contains all features that are not site-specific.
 */

// TODO make these options changeable in the extension button drop-down
let scrollMultiplier = 13;
let scrollSprintMultiplier = 2;

// Scrolling
window.addEventListener( "rightanalogverticalpoll", function( e ) {
	let val = e.detail.current;
	if ( val < 0.15 && val > -0.15 ) {
		return;
	}

	let m = e.detail.controller.buttons[11].pressed ? scrollMultiplier * scrollSprintMultiplier : scrollMultiplier;
	window.scrollBy( 0, val * m );
} );

// Forward / backwards through history
window.addEventListener( "bbuttonpressed", function( e ) {
	let leftBumper = e.detail.controller.buttons[4];
	let rightBumper = e.detail.controller.buttons[5];
	if ( leftBumper.pressed && !rightBumper.pressed ) {
		window.history.back();
	} else if ( rightBumper.pressed && !leftBumper.pressed ) {
		window.history.forward();
	}
} );