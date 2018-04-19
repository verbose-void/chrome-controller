let selectedVideoIndex = -1;

// Navigate through the avalable videos to watch
window.addEventListener( "leftanalogverticalmax", function( e ) {
	let curr = e.detail.current;
	let prev = e.detail.previous;

	if ( prev == curr ) {
		return;
	}

	// TODO test for no more videos
	if ( curr >= 1 ) {
		selectVideo( selectedVideoIndex + 1 );
	} else if ( curr <= -1 ) {
		selectVideo( selectedVideoIndex - 1 );
	}
}; );

// X pauses and plays the video
window.addEventListener( "xbuttonpressed", function() {
	let playButton = $( ".ytp-play-button.ytp-button" );
	playButton.trigger( "click" );
} );

// B makeshift zoom
window.addEventListener( "bbuttonpressed", function() {
	let fs = $( ".ytp-size-button" );
	fs.trigger( "click" );
	chrome.runtime.sendMessage( {eventType: "requestsetzoom", zoom: avg} );
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

// TODO add to a utils file
function scrollToVisible( elm ) {
	let topBarHeight = $( "#container" ).height();

	let rect = elm.getBoundingClientRect();
	let viewHeight = Math.max( document.documentElement.clientHeight, window.innerHeight );
	  
	// Get how much off screen it is
	let bOff = rect.bottom - viewHeight;
	let tOff = rect.top - topBarHeight;

	if ( bOff > 0 ) {
		window.scrollBy( 0, bOff + 50 );
	} else if ( tOff < 0 ) {
		window.scrollBy( 0, tOff - rect.height + 40 );
	}
}

function selectVideo( toSelect ) {
	let thumbnail = $( ".ytd-thumbnail#thumbnail" ).get( toSelect );

	scrollToVisible( thumbnail );
	thumbnail.style["border-style"] = "solid";
	thumbnail.style["border-color"] = "red";
	thumbnail.style["border-width"] = "2px";

	deselectVideo( selectedVideoIndex );
	selectedVideoIndex = toSelect;
}

function deselectVideo( toDeselect ) {
	let thumbnail = $( ".ytd-thumbnail#thumbnail" ).get( toDeselect );
	thumbnail.style["border-style"] = "none";
}