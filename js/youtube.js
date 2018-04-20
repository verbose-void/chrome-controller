var selectedVideoIndex = -1;

// A Button "clicks" on the video
window.addEventListener( "abuttonpressed", function() {
	if ( selectedVideoIndex < 0 ) {
		return;
	}

	window.location.href = $( "ytd-thumbnail" ).get( selectedVideoIndex ).children[0].href;
	deselectAll();
} );

// Navigate horizontally through the avalable videos to watch
window.addEventListener( "leftanaloghorizontalmax", function( e ) {
	let curr = e.detail.current;
	let prev = e.detail.previous;
	let ct;

	if ( prev == curr ) {
		return;
	}

	// TODO test for no more videos
	if ( curr >= 1 ) {
		selectVideo( selectedVideoIndex + 1 );
	} else if ( curr <= -1 ) {
		selectVideo( selectedVideoIndex - 1 );
	}
} );

// Navigate vertically through the avalable videos to watch
window.addEventListener( "leftanalogverticalmax", function( e ) {
	let curr = e.detail.current;
	let prev = e.detail.previous;
	let ct;
	if ( selectedVideoIndex != -1 ) {
		ct = $( "ytd-thumbnail" ).get( selectedVideoIndex ).parentElement.parentElement.parentElement;
	}

	let changeBy = 1;

	if ( ct && ct.id == "items" ) {
		changeBy = Math.floor( ct.offsetWidth / 210 );
	}

	if ( prev == curr ) {
		return;
	}

	// TODO test for no more videos
	if ( curr >= 1 ) {
		selectVideo( selectedVideoIndex + changeBy );
	} else if ( curr <= -1 ) {
		selectVideo( selectedVideoIndex - changeBy );
	}
} );

// TODO add to a utils file
function scrollToVisible( elm ) {
	if ( !elm ) {
		return;
	}

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
	let thumbnail = $( "ytd-thumbnail" ).get( toSelect );

	if ( !thumbnail ) {
		return;
	}

	scrollToVisible( thumbnail );
	thumbnail.style["border-style"] = "solid";
	thumbnail.style["border-color"] = "red";
	thumbnail.style["border-width"] = "2px";

	deselectVideo( selectedVideoIndex );
	selectedVideoIndex = toSelect;
}

function deselectVideo( toDeselect ) {
	let thumbnail = $( "ytd-thumbnail" ).get( toDeselect );
	thumbnail.style["border-style"] = "none";
}

function deselectAll() {
	let thumbnails = $( "ytd-thumbnail" );
	selectedVideoIndex = -1;

	for ( let elem in thumbnails ) {
		thumbnails[elem].style["border-style"] = "none";
	}
}