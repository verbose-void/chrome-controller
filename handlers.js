let scrollMultiplier = 13;
let scrollSprintMultiplier = 2;

window.addEventListener( "rightanalogverticalpoll", function( e ) {
	let m = e.detail.controller.buttons[11].pressed ? scrollMultiplier * scrollSprintMultiplier : scrollMultiplier;
	window.scrollBy( 0, e.detail.current * m );
} );