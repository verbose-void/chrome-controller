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

// Backward through history
window.addEventListener( "leftbumperpressed", function() {
	window.history.back();
} );

// Forward through history
window.addEventListener( "rightbumperpressed", function() {
	window.history.forward();
} );

// Zoom in and out
window.addEventListener( "rightanaloghorizontalpoll", function( e ) {
	let rightValue = e.detail.current;
	let leftValue = e.detail.controller.axes[0];
	let avg = ( rightValue * -1 + leftValue ) / 2;

	if ( rightValue > 0.2 && leftValue < -0.2 ) {
		// TODO move function to a utils file
		console.log( avg );
		chrome.runtime.sendMessage( {eventType: "requestzoom", factor: avg} );
	} else if ( rightValue < -0.2 && leftValue > 0.2 ) {
		// TODO move function to a utils file
		console.log( avg );
		chrome.runtime.sendMessage( {eventType: "requestzoom", factor: avg} );
	}
} );