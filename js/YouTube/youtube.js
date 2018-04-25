var selectedClickable;
var sideBarIndex = -1;
var deselectTimeout;
var deselectTiming;
const topBarHeight = 55;

updateSettings();

function updateSettings() {
	chrome.storage.sync.get( ["select-time"], function( results ) {
		if ( results["select-time"] === "never" ) {
			deselectTiming = "never";
			return;
		}

		deselectTiming = results["select-time"] ? results["select-time"] * 1000 : deselectTiming;
	} );
}

chrome.runtime.onMessage.addListener( function( req ) {
	if ( req.type === "settings-updated" ) {
		updateSettings();
	}
} );

// A Button "clicks" on the video
window.addEventListener( "abuttonpressed", function() {
	if ( !selectedClickable ) {
		return;
	}

	if ( isSidebarOpen() ) {
		if ( sideBarIndex < 0 ) {
			return;
		}

		window.location.href = $( "a#endpoint" ).get( sideBarIndex ).children[0].click();
		return;
	}

	let href = selectedClickable.children[0].href;

	if ( !href ) {
		selectedClickable.click();
		return;
	}

	window.location.href = selectedClickable.children[0].href;
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

	scheduleDeselectTimeout();

	if ( !isSidebarOpen() ) {
		if ( !isValidElement( selectedClickable ) || !isOnScreen( selectedClickable ) ) {
			selectClickable( getFirstClickableOnScreen() );
			return;
		} else if ( !isSelectedMarked() ) {
			forceSelectClickable( selectedClickable );
			return;
		}
	}

	
	if ( curr >= 1 ) {
		let arrow = getArrowButtonToSide( selectedClickable, "right" );

		if ( arrow ) {
			arrow.click();
			return;
		}
	} else if ( curr <= -1 ) {
		let arrow = getArrowButtonToSide( selectedClickable, "left" );

		if ( arrow ) {
			arrow.click();
			return;
		}
	}
	


	let contentContainer = $( "#contentContainer" ).get( 0 );
	let scrim = $( "#scrim" ).get( 0 );
	let appDrawer = $( "app-drawer#guide" ).get( 0 );
	if ( contentContainer ) {
		if ( isSidebarOpen() ) {
			if ( curr <= -1 ) {
				return;
			} else if ( curr >= 1 ) {
				toggleSidebarView();

				forceSelectClickable( selectedClickable );
				return;
			}
		} else {
			if ( curr <= -1 ) {
				if ( isFarLeft( selectedClickable ) ) {
					deselectVideo( selectedClickable );
					toggleSidebarView();
					forceSelectSidebar( sideBarIndex );
					return;
				}
			}
		}
	}

	if ( curr >= 1 ) {
		selectClickable( getClickableToSide( selectedClickable, "right" ) );
	} else if ( curr <= -1 ) {
		selectClickable( getClickableToSide( selectedClickable, "left" ) );
	}
} );

// Navigate vertically through the avalable videos to watch
window.addEventListener( "leftanalogverticalmax", function( e ) {
	let curr = e.detail.current;
	let prev = e.detail.previous;

	if ( prev == curr ) {
		return;
	}

	scheduleDeselectTimeout();

	if ( isSidebarOpen() ) {
		if ( curr >= 1 ) {
			selectSidebar( sideBarIndex + 1 );
		} else if ( curr <= -1 ) {
			selectSidebar( sideBarIndex - 1 );
		}

		return;
	}

	if ( !isValidElement( selectedClickable ) || !isOnScreen( selectedClickable ) ) {
		selectClickable( getFirstClickableOnScreen() );
		return;
	} else if ( !isSelectedMarked() ) {
		forceSelectClickable( selectedClickable );
		return;
	}

	if ( curr >= 1 ) {
		selectClickable( getClickableToSide( selectedClickable, "bottom" ) );
	} else if ( curr <= -1 ) {
		selectClickable( getClickableToSide( selectedClickable, "top" ) );
	}
} );

function isSelectedMarked() {
	if ( !selectedClickable ) {
		return null;
	}

	let bs = selectedClickable.style["border-style"];

	if ( !bs ) {
		return false;
	}

	return bs === "solid";
}

function scheduleDeselectTimeout() {
	if ( deselectTimeout ) {
		window.clearTimeout( deselectTimeout );
	}

	if ( deselectTiming !== "never" ) {
		deselectTimeout = setTimeout( function() {
			if ( selectedClickable ) {
				deselectVideo( selectedClickable );
			}

			if ( isSidebarOpen() ) {
				toggleSidebarView();
			}

			deselectTimeout = undefined;
		}, deselectTiming );
	}
}

function isValidElement( elem ) {
	if ( !elem ) {
		return false;
	}

	let rect = elem.getBoundingClientRect();

	for ( let i in rect ) {
		if ( typeof rect[i] == typeof( 0 ) && rect[i] !== 0 ) {
			return true;
		}
	}

	return false;
}

function getFirstClickableOnScreen() {
	let temp;

	for ( let y = topBarHeight; y <= window.innerHeight; y += 20 ) {
		for ( let x = 0; x <= window.innerWidth; x += 20 ) {
			let v = getClickableAt( x, y );

			if ( v ) {
				let rect = v.getBoundingClientRect();
				// Make sure the video is all the way on screen
				if ( isOnScreen( v ) ) {
					return v;
				} else if ( !temp ) {
					// Log first one found so that if no fully-on-screen items are found, it will return the first.
					temp = v;
				}
			}
		}
	}

	if ( temp ) {
		return temp;
	}

	let p = $( "ytd-thumbnail" ).get( 0 );

	if ( p ) {
		return p;
	}

	return null;
}

function isOnScreen( elem ) {
	let rect = elem.getBoundingClientRect();
	return ( rect.x >= 0 && rect.x + rect.width <= window.innerWidth ) &&
		   ( rect.y >= topBarHeight && rect.y + rect.height <= window.innerHeight );
}

function getClickableAt( x, y ) {
	let elems = document.elementsFromPoint( x, y );

	for ( let i in elems ) {
		let cur = elems[i];
		let tag = cur.tagName;
		let aria =  $( cur ).attr( "aria-label" );

		let hc = function( c ) {
			return $( cur ).hasClass( c );
		};

		if ( tag === "YTD-THUMBNAIL" || 
		   ( tag === "PAPER-BUTTON" && aria === "Subscribe to this channel." ) ||
		   ( tag === "A" && hc( "ytd-shelf-renderer" ) ) ||
		   ( tag === "PAPER-TAB" ) && hc( "ytd-c4-tabbed-header-renderer" )  ||
		   ( tag === "YTD-TOGGLE-BUTTON-RENDERER" ) && cur.parentElement.id === "top-level-buttons" ) {
			return elems[i];
		}
	}
}

function getArrowButtonToSide( elem, side ) {
	if ( !elem ) {
		return;
	}

	if ( side !== "right" && side !== "left" ) {
		console.error( "Side must be right or left." );
		return;
	}

	let rect = elem.getBoundingClientRect();
	let center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

	let potn = document.elementsFromPoint( side === "right" ? center.x + rect.width / 2 : center.x - rect.width / 2, center.y );

	for ( let i in potn ) {
		if ( potn[i].tagName === "YT-ICON-BUTTON" ) {
			let child = potn[i].children[0];
			if ( child && $( child ).attr( "aria-label" ) === side === "right" ? "Next" : "Previous" ) {
				return potn[i];
			}
		}
	}

	return null;
}

function getClickableToSide( elem, side ) {
	if ( side !== "left" && side !== "right" && side !== "top" && side !== "bottom" ) {
		console.error( "Side must be left, right, top, or bottom." );
		return;
	}

	const rect = elem.getBoundingClientRect();
	const mod = { x: 60, y: 10 };
	const center = { x: rect.x + ( rect.width / 2 ), y: rect.y + ( rect.height / 2 ) };

	var scanX = function( y ) {
		if ( side === "left" ) {
			for ( let x = center.x - ( rect.width * 0.6 ); x >= 0; x -= mod.x ) {
				let potn = getClickableAt( x, y );

				if ( potn ) {
					return potn;
				}
			}
		} else if ( side === "right" ) {
			for ( let x = center.x + ( rect.width * 0.6 ); x <= window.innerWidth; x += mod.x ) {
				let potn = getClickableAt( x, y );

				if ( potn ) {
					return potn;
				}
			}
		}

		return null;
	}

	var scanY = function( x ) {
		if ( side === "top" ) {
			for ( let y = center.y - ( rect.height * 0.6 ); y >= 0; y -= mod.y ) {
				let potn = getClickableAt( x, y );

				if ( potn ) {
					return potn;
				}
			}
		} else if ( side === "bottom" ) {
			for ( let y = center.y + ( rect.height * 0.6 ); y <= window.innerHeight; y += mod.y ) {
				let potn = getClickableAt( x, y );

				if ( potn ) {
					return potn;
				}
			}
		}
	}

	if ( side === "right" || side === "left" ) {
		for ( let y = center.y; y >= 0; y -= mod.y ) {
			let potn = scanX( y );

			if ( potn ) {
				return potn;
			}
		}

		for ( let y = center.y + ( rect.height * 0.6 ); y <= window.innerHeight; y += mod.y ) {
			let potn = scanX( y );

			if ( potn ) {
				return potn;
			}
		}
	} else {
		for ( let x = center.x - 50; x >= 0; x -= mod.x ) {
			let potn = scanY( x );

			if ( potn ) {
				return potn;
			}
		}

		for ( let x = center.x + 50; x <= window.innerWidth; x += mod.x ) {
			let potn = scanY( x );

			if ( potn ) {
				return potn;
			}
		}
	}

	if ( side === "right" || side === "left" ) {
		return null;
	}

	return null;
}

function isFarLeft( elem ) {
	return !getClickableToSide( elem, "left" );
}

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
	return $( "div#contentContainer.app-drawer" ).get( 0 ).getAttribute( "opened" ) != null;
}

function forceSelectClickable( toSelect ) {
	selectClickable( toSelect, true );
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
		}, 10 * ___c );

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

function selectClickable( toSelect, b ) {
	if ( !toSelect ) {
		return;
	}

	if ( !b ) {
		if ( isValidElement( selectedClickable ) ) {
			deselectVideo( selectedClickable );
		}
	}

	scrollToVisible( toSelect );
	toSelect.style["border-style"] = "solid";

	let color = "red";

	if ( $( toSelect ).attr( "aria-label" ) === "Subscribe to this channel." ) {
		color = "white";
	}

	toSelect.style["border-color"] = color;
	toSelect.style["border-width"] = "2px";

	selectedClickable = toSelect;
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