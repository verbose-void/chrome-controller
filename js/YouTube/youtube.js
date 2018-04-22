var selectedVideo;
var sideBarIndex = -1;

// A Button "clicks" on the video
window.addEventListener( "abuttonpressed", function() {
	if ( !selectedVideo ) {
		return;
	}

	if ( isSidebarOpen() ) {
		if ( sideBarIndex < 0 ) {
			return;
		}

		window.location.href = $( "a#endpoint" ).get( sideBarIndex ).children[0].click();
		return;
	}

	window.location.href = selectedVideo.children[0].href;
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
				forceSelectVideo( selectedVideo );
				return;
			}
		} else {
			if ( curr <= -1 ) {
				if ( isFarLeft( selectedVideo ) ) {
					deselectVideo( selectedVideo );
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
		selectVideo( getVideoToRight( selectedVideo ) );
	} else if ( curr <= -1 ) {
		selectVideo( getVideoToLeft( selectedVideo ) );
	}
} );

function getVideoTo( elem, side, modifierx, modifiery ) {
	if ( !modifierx ) {
		modifierx = 0;
	}

	if ( !modifiery ) {
		modifiery = 0;
	}

	if ( elem ) {
		let rect = elem.getBoundingClientRect();
		let x = 0;
		let y = 0;

		if ( side === "left" ) {
			x = -rect.width;
		} else if ( side === "right" ) {
			x = rect.width;
		} else if ( side === "up" ) {
			y = -rect.height;
		} else if ( side === "down" ) {
			y = rect.height;
		}

		let ex = ( rect.x + rect.width / 2 ) + x + modifierx;
		let ey = ( rect.y + rect.height / 2 ) + y + ( y * .5 ) + modifiery;

		if ( ex > window.innerWidth || ex < 0 ) {
			window.scrollBy( ex, 0 );
		}

		if ( ey > window.innerHeight || ey < 0 ) {
			window.scrollBy( 0, ( ey + ey * .4 ) - window.innerHeight );
		}

		let elems = document.elementsFromPoint( ex, ey );

		for ( let i in elems ) {
			if ( elems[i].tagName === "YTD-THUMBNAIL" ) {
				return elems[i];
			}
		}
	}
}

function getVideoToLeft( elem ) {
	return getVideoTo( elem, "left" );
}

function getVideoToRight( elem ) {
	return getVideoTo( elem, "right" );
}

function getVideoToTop( elem ) {
	let up = getVideoTo( elem, "up" );

	if ( !up ) {
		up = getVideoTo( elem, "up", 0, -100 );
	}

	return up;
}

function getVideoToBottom( elem ) {
	let down = getVideoTo( elem, "down" );

	if ( !down ) {
		down = getVideoTo( elem, "down", 0, 100 );
	}

	return down;
}

function isFarLeft( elem ) {
	return !getVideoToLeft( elem );
}

// Navigate vertically through the avalable videos to watch
window.addEventListener( "leftanalogverticalmax", function( e ) {
	let curr = e.detail.current;
	let prev = e.detail.previous;

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

	if ( !selectedVideo ) {
		selectedVideo = $( "ytd-thumbnail" ).get( 0 );
	}

	if ( curr >= 1 ) {
		selectVideo( getVideoToBottom( selectedVideo ) );
	} else if ( curr <= -1 ) {
		selectVideo( getVideoToTop( selectedVideo ) );
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

	if ( !b ) {
		deselectSidebar( sideBarIndex );
	}

	let item = sideBarItems.get( toSelect );

	scrollToVisible( item );
	item.style["border-style"] = "solid";
	item.style["border-color"] = "red";
	item.style["border-width"] = "2px";

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
	if ( !toSelect ) {
		return;
	}

	if ( !b ) {
		if ( selectedVideo ) {
			deselectVideo( selectedVideo );
		}
	}

	scrollToVisible( toSelect );
	toSelect.style["border-style"] = "solid";
	toSelect.style["border-color"] = "red";
	toSelect.style["border-width"] = "2px";

	selectedVideo = toSelect;
}

function deselectVideo( toDeselect ) {
	toDeselect.style["border-style"] = "none";
}

function deselectAll() {
	let thumbnails = $( "ytd-thumbnail" );

	for ( let elem in thumbnails ) {
		if ( thumbnails[elem].style ) {
			thumbnails[elem].style["border-style"] = "none";
		}
	}
}