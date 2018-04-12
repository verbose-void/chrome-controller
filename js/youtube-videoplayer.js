// X pauses and plays the video
window.addEventListener( "xbuttonpressed", function() {
	let playButton = $( ".ytp-play-button.ytp-button" );
	playButton.trigger( "click" );
} );

// B toggle theater mode
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