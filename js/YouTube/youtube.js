var selectedVideoIndex = -1;
var sideBarIndex = -1;

// A Button "clicks" on the video
window.addEventListener( "abuttonpressed", function() {
	if ( selectedVideoIndex < 0 ) {
		return;
	}

	if ( isSidebarOpen() ) {
		if ( sideBarIndex < 0 ) {
			return;
		}

		window.location.href = $( "a#endpoint" ).get( sideBarIndex ).children[0].click();
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

	let contentContainer = $( "#contentContainer" ).get( 0 );
	let scrim = $( "#scrim" ).get( 0 );
	let appDrawer = $( "app-drawer#guide" ).get( 0 );
	if ( contentContainer ) {
		if ( isSidebarOpen() ) {
			if ( curr <= -1 ) {
				return;
			} else if ( curr >= 1 ) {
				// TODO Set currently selected to closest video
				toggleSidebarView();
				forceSelectVideo( selectedVideoIndex );
				return;
			}
		} else {
			if ( curr <= -1 ) {
				// TODO check if selected is far left
				let currentSelection = $( "ytd-thumbnail" ).get( selectedVideoIndex );

				if ( selectedVideoIndex == 0 ) {
					deselectVideo( selectedVideoIndex );
					toggleSidebarView();
					forceSelectSidebar( sideBarIndex );
					// TODO set current contentContainerIndex (needs to be created) to top index
					return;
				}
			}
		}
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

	if ( prev == curr ) {
		return;
	}

	if ( isSidebarOpen() ) {
		if ( curr >= 1 ) {
			selectSidebar( sideBarIndex + 1 );
		} else if ( curr <= -1 ) {
			selectSidebar( sideBarIndex - 1 );
		}

		return;
	}

	if ( selectedVideoIndex != -1 ) {
		ct = $( "ytd-thumbnail" ).get( selectedVideoIndex ).parentElement.parentElement.parentElement;
	}

	let changeBy = 1;

	if ( ct && ct.id == "items" ) {
		changeBy = Math.floor( ct.offsetWidth / 210 );
	}

	if ( curr >= 1 ) {
		selectVideo( selectedVideoIndex + changeBy );
	} else if ( curr <= -1 ) {
		selectVideo( selectedVideoIndex - changeBy );
	}
} );

function toggleSidebarView() {
	$( "#guide-icon" ).click();
}

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
		if ( isSidebarOpen() ) {
			$( "div#guide-inner-content" ).get( 0 ).scrollBy( 0, bOff + 25 );
		} else {
			window.scrollBy( 0, bOff + 50 );
		}
	} else if ( tOff < 0 ) {
		if ( isSidebarOpen() ) {
			$( "div#guide-inner-content" ).get( 0 ).scrollBy( 0, tOff - rect.height + 40 );
		} else {
			window.scrollBy( 0, tOff - rect.height + 40 );
		}
	}
}

function isSidebarOpen() {
	return $( "#contentContainer" ).get( 0 ).getAttribute( "opened" ) != null;
}

function forceSelectVideo( toSelect ) {
	selectVideo( toSelect, true );
}

var ___c = 0;

function forceSelectSidebar( toSelect ) {
	selectSidebar( toSelect, true );
}

function selectSidebar( toSelect, b ) {
	if ( toSelect <= 0 && sideBarIndex == 0 ) {
		return;
	}

	if ( toSelect < 0 ) {
		toSelect = 0;
	}

	let sideBarItems = $( "a#endpoint" );

	if ( sideBarItems.length < 1 ) {
		if ( ___c >= 10 ) {
			throw new Error( "Could not find side-bar items." );
			return;
		}

		setTimeout( function() {
			selectSidebar( toSelect );
		}, 100 );

		___c ++;
		return;
	}
	___c = 0;

	if ( toSelect >= sideBarItems.length ) {
		return;
	}

	let item = sideBarItems.get( toSelect );

	scrollToVisible( item );
	item.style["border-style"] = "solid";
	item.style["border-color"] = "red";
	item.style["border-width"] = "2px";

	if ( !b ) {
		deselectSidebar( sideBarIndex );
	}
	sideBarIndex = toSelect;
}

function deselectSidebar( toDeselect ) {
	let sideBarItems = $( "a#endpoint" );

	if ( sideBarItems.length < 1 ) {
		if ( ___c >= 10 ) {
			throw new Error( "Could not find side-bar items." );
			return;
		}

		setTimeout( function() {
			deselectSidebar( toDeselect );
		}, 100 );

		___c ++;
		return;
	}
	___c = 0;

	let item = sideBarItems.get( toDeselect );
	item.style["border-style"] = "none";
}

function selectVideo( toSelect, b ) {
	let thumbnail = $( "ytd-thumbnail" ).get( toSelect );

	if ( !thumbnail ) {
		return;
	}

	scrollToVisible( thumbnail );
	thumbnail.style["border-style"] = "solid";
	thumbnail.style["border-color"] = "red";
	thumbnail.style["border-width"] = "2px";

	if ( !b ) {
		deselectVideo( selectedVideoIndex );
	}
	selectedVideoIndex = toSelect;
}

function deselectVideo( toDeselect ) {
	let thumbnail = $( "ytd-thumbnail" ).get( toDeselect );
	thumbnail.style["border-style"] = "none";
}

function deselectAll() {
	let thumbnails = $( "ytd-thumbnail" );

	for ( let elem in thumbnails ) {
		if ( thumbnails[elem].style ) {
			thumbnails[elem].style["border-style"] = "none";
		}
	}
}