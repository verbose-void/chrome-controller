/*
 *	Contains all features that are not site-specific.
 */

var scrollMultiplier;
var scrollSprintMultiplier;

updateSettings();

function updateSettings() {
	chrome.storage.sync.get( ["scroll-sensitivity", "scroll-sprint"], function( results ) {
		scrollMultiplier = results["scroll-sensitivity"] ? results["scroll-sensitivity"] : scrollMultiplier;
		scrollSprintMultiplier = results["scroll-sprint"] ? results["scroll-sprint"] : scrollSprintMultiplier;
	} );
};

chrome.runtime.onMessage.addListener( function( req ) {
	// Repeat code because updateSettings can't be used.
	if ( req.type === "settings-updated" ) {
		chrome.storage.sync.get( ["scroll-sensitivity", "scroll-sprint"], function( results ) {
			scrollMultiplier = results["scroll-sensitivity"] ? results["scroll-sensitivity"] : scrollMultiplier;
			scrollSprintMultiplier = results["scroll-sprint"] ? results["scroll-sprint"] : scrollSprintMultiplier;
		} );
	}
} );

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
		chrome.runtime.sendMessage( {eventType: "requestzoom", factor: avg} );
	} else if ( rightValue < -0.2 && leftValue > 0.2 ) {
		// TODO move function to a utils file
		chrome.runtime.sendMessage( {eventType: "requestzoom", factor: avg} );
	}
} );