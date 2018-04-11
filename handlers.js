let scrollMultiplier = 10;
let sprintScrollMultiplier = 2.5;

function handleRightThumbstick( horizontalAxis, verticalAxis, controller ) {
	if ( verticalAxis > 0.2 || verticalAxis < 0.2 ) {
		let m = controller.buttons[11].pressed ? scrollMultiplier * sprintScrollMultiplier : scrollMultiplier;
		window.scrollBy( 0, verticalAxis * m );
	}
}