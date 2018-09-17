window.addEventListener( "xbuttonreleased", () => {
	press( ".ytp-play-button.ytp-button" );
} );

window.addEventListener( "bbuttonreleased", () => {
	press( ".ytp-size-button.ytp-button" );
} );

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

function press( sel ) {
	let $s = $( sel );
	if ( $s[0] ) {
		$s.click();
	}
}

$( function loader() {
	if ( !buttons.loaded ) {
		setTimeout( loader, 100 );
	}

	if ( buttons.controllerType() === "PS" ) {
		buttons.currentScheme = buttons.schemes.youtube_player.ps;
	} else {
		buttons.currentScheme = buttons.schemes.youtube_player.xbox;
	}
} );