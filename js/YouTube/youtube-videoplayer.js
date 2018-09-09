// X pauses and plays the video
window.addEventListener( "xbuttonpressed", function() {
	let playButton = $( ".ytp-play-button.ytp-button" );
	playButton.trigger( "click" );
} );

// B makeshift zoom
window.addEventListener( "bbuttonpressed", function() {
	let fs = $( ".ytp-size-button" );
	fs.trigger( "click" );
} );

// holding Y displays the bar at the bottom
window.addEventListener( "ybuttonpoll", function() {
	let vc = $( "div .html5-video-player" );
	vc.removeClass( "ytp-autohide" );
} );

window.addEventListener( "ybuttonreleased", function() {
	let vc = $( "div .html5-video-player" );
	if ( !vc.hasClass( "ytp-autohide" ) ) {
		vc.addClass( "ytp-autohide" );
	}
} );

window.addEventListener( "leftanaloghorizontal", function initializer() {
	window.removeEventListener( "leftanaloghorizontal", initializer );
	let info = $( "body div#info-contents" );

	info.prepend( "<div><div class='xbox-y'><p class='b-label'>HUD</p></div></div>" );
	info.prepend( "<div><div class='xbox-b'><p class='b-label'>THEATER</p></div></div>" );
	info.prepend( "<div><div class='xbox-x'><p class='b-label'>PLAY/PAUSE</p></div></div>" );
} );