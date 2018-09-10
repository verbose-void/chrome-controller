// Scrolling
window.addEventListener( "rightanalogverticalpoll", e => { 
	const am = e.detail.current < 0.1 && e.detail.current > -0.1 ? 0 : e.detail.current * ccSettings.scroll.multiplier;
	if ( am !== 0 ) {
		window.scrollBy( 0, e.detail.controller.buttons[11].pressed ? am * ccSettings.scroll.sprintMultiplier  : am );
	}
}, true );

// History Seeking
window.addEventListener( "leftbumperreleased", () => { window.history.back() }, true );
window.addEventListener( "rightbumperreleased", () => { window.history.forward() }, true );