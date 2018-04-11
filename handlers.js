let scrollMultiplier = 10;
let sprintScrollMultiplier = 2.5;
let currentElement = {
	index: 0,
	element: null
};
let holdStatus = {};

// TODO add idle thresholds to prevent from ghost scrolling
function handleRightThumbstick( horizontalAxis, verticalAxis, controller ) {
	if ( verticalAxis > 0.2 || verticalAxis < 0.2 ) {
		let m = controller.buttons[11].pressed ? scrollMultiplier * sprintScrollMultiplier : scrollMultiplier;
		window.scrollBy( 0, verticalAxis * m );
	}
}

function handleLeftThumbstick( horizontalAxis, verticalAxis, controller ) {
	let horizontalChanged = false;

	// handle infinite polling
	switch( horizontalAxis ) {
		case 1: 
			if ( holdStatus.leftThumbstickHorizontal == "right" ) {
				// console.log( "held right" );
				return;
			}
			// console.log( "pressed right" );
			holdStatus.leftThumbstickHorizontal = "right";
			currentElement.index++;
			horizontalChanged = true;
			break;
		case -1:
			if ( holdStatus.leftThumbstickHorizontal == "left" ) {
				// console.log( "held left" );
				return;
			}
			// console.log( "pressed left" );
			holdStatus.leftThumbstickHorizontal = "left";
			currentElement.index--;
			horizontalChanged = true;
			break;
		default:
			delete holdStatus.leftThumbstickHorizontal;
			// console.log( "released" );
	}

	let vidsPerRow = Math.floor( getContainerWidth( currentElement.element ) / 210 );

	switch( verticalAxis ) {
		case 1: 
			if ( holdStatus.leftThumbstickVertical == "down" ) {
				// console.log( "held down" );
				return;
			}
			// console.log( "pressed down" );
			holdStatus.leftThumbstickVertical = "down";
			currentElement.index += vidsPerRow;
			break;
		case -1:
			if ( holdStatus.leftThumbstickVertical == "up" ) {
				// console.log( "held up" );
				return;
			}
			// console.log( "pressed up" );
			holdStatus.leftThumbstickVertical = "up";
			currentElement.index -= vidsPerRow;
			break;
		default:
			delete holdStatus.leftThumbstickVertical;
			// console.log( "released" );
			if ( !horizontalChanged ) {
				return;
			}
	}

	let previous = currentElement.element;
	deAnimateSelector( previous, 5 );
	currentElement.element = document.getElementsByClassName( "style-scope ytd-grid-renderer" )[currentElement.index];
	animateSelector( currentElement.element, 5 );
}

// only fires when A button pressed (for xbox controllers)
function handleAButton( controller ) {
	click( currentElement.element );
}

function animateSelector( element, width ) {
	if ( !element ) {
		return;
	}

	for ( let curWidth = 0; curWidth < width; curWidth++ ) {
		setTimeout( function() {
			element.style.outline = curWidth + "px solid red";
		}, 20 * curWidth );
	}
}

function deAnimateSelector( element, width ) {
	if ( !element ) {
		return;
	}

	let count = 0;
	for ( let curWidth = width; curWidth >= 0; curWidth-- ) {
		setTimeout( function() {
			element.style.outline = curWidth + "px solid red";
		}, 20 * count );
		count++;
	}
}

function click( element ) {
	element.childNodes.forEach( function( node ) {
		if ( node.id == ( "video-title" ) ) {
			window.open( node.href, "_self" );
		} else {
			click( node );
		}
	} );
}

function getContainerWidth( element ) {
	if ( !element ) {
		return;
	}

	if ( element.id == "items" ) {
		return element.offsetWidth;
	} 
	return getContainerWidth( element.parentNode );
}