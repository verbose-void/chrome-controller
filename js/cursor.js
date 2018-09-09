// Add canvas overlay for cursor rendering
var canvas;
var cursor;

var horizontalSpeed = 10;
var verticalSpeed = 10;
var idleHideMiliseconds = 5000;
var outerColor = "#000000";
var innerColor = "#f45342";
var outerColor = convertHex( outerColor );
var innerColor = convertHex( innerColor );

updateSettings();

function updateSettings() {
	chrome.storage.sync.get( ["outer-color", "horizontal-cursor-sensitivity", "vertical-cursor-sensitivity", "idle-cursor-timer"], function( results ) {
		horizontalSpeed = results["horizontal-cursor-sensitivity"] ? results["horizontal-cursor-sensitivity"] : horizontalSpeed;
		verticalSpeed = results["vertical-cursor-sensitivity"] ? results["vertical-cursor-sensitivity"] : verticalSpeed;
		idleHideMiliseconds = results["idle-cursor-timer"] ? results["idle-cursor-timer"] : idleHideMiliseconds;
		outerColor = results["outer-color"] ? convertHex( results["outer-color"] ) : outerColor;
		innerColor = results["inner-color"] ? convertHex( results["inner-color"] ) : innerColor;
	} );
};

chrome.runtime.onMessage.addListener( function( req ) {
	// Repeat code because updateSettings can't be used.
	if ( req.type === "settings-updated" ) {
		chrome.storage.sync.get( ["outer-color", "horizontal-cursor-sensitivity", "vertical-cursor-sensitivity", "idle-cursor-timer"], function( results ) {
			horizontalSpeed = results["horizontal-cursor-sensitivity"] ? results["horizontal-cursor-sensitivity"] : horizontalSpeed;
			verticalSpeed = results["vertical-cursor-sensitivity"] ? results["vertical-cursor-sensitivity"] : verticalSpeed;
			idleHideMiliseconds = results["idle-cursor-timer"] ? results["idle-cursor-timer"] : idleHideMiliseconds;
			outerColor = results["outer-color"] ? convertHex( results["outer-color"] ) : outerColor;
			innerColor = results["inner-color"] ? convertHex( results["inner-color"] ) : innerColor;
		} );
	}
} );

function setup() {
 	canvas = createCanvas( windowWidth, windowHeight );
	$( "#defaultCanvas0" ).addClass( "cursor-canvas" );
	$( window ).resize( resize ).resize();
	cursor = new Cursor();
	ellipseMode( RADIUS );
}

function draw() {
	clear();
	if ( cursor.update ) {
		cursor.update();
	}
}

function Cursor() {
	this.x = windowWidth / 2;
	this.y = windowHeight / 2;

	// TODO make radius a setting
	this.radius = 15;
	this.viewRadius = 3;

	// TODO make setting
	this.maxOpacity = 100;
	this.opacity = 0;
}

Cursor.prototype.show = function( curs ) {
	if ( !curs ) {
		curs = this;
	}

	if ( curs.viewRadius < curs.radius ) {
		curs.viewRadius = curs.viewRadius == 0 ? 3 : curs.viewRadius * 1.1;
	} else {
		curs.viewRadius = curs.radius;
	}

	if ( curs.opacity < curs.maxOpacity ) {
		curs.opacity = curs.opacity == 0 ? 5 : curs.opacity * 1.2;
		setTimeout( function() { curs.show() }, 10 );
	} else {
		curs.opacity = curs.maxOpacity;
	}
}

Cursor.prototype.hide = function( curs ) {
	if ( !curs ) {
		curs = this;
	}

	curs.lastIdle = null;

	if ( curs.viewRadius > 5 ) {
		curs.viewRadius *= 0.9;
	} else {
		curs.viewRadius = 3;
	}

	if ( curs.opacity > 10 ) {
		curs.opacity *= 0.8;
		setTimeout( function() { curs.hide() }, 10 );
	} else {
		curs.opacity = 0;
	}
}

Cursor.prototype.update = function() {
	ellipse( this.x, this.y, 3, 3 );
	fill( outerColor[0], outerColor[1], outerColor[2], this.opacity );
	ellipse( this.x, this.y, this.viewRadius, this.viewRadius );
	fill( innerColor[0], innerColor[1], innerColor[2], this.opacity );
	noStroke();

	// if position was changed from last poll
	if (   ( this.previousX && Math.abs( this.previousX - this.x ) > 0.01 )
		&& ( this.previousY && Math.abs( this.previousY - this.y ) > 0.01 ) ) {
		this.currentElement = document.elementFromPoint( this.x, this.y );
		if ( this.opacity < 1 ) {
			this.show();
		}

		this.moved = true;
	} else {
		// cursor is idle
		if ( this.opacity >= this.maxOpacity ) {
			if ( this.moved ) {
				this.lastIdle = new Date();
			} else {
				if ( new Date().getTime() - this.lastIdle.getTime() > idleHideMiliseconds ) {
					this.hide();
				}
			}
			this.moved = false;
		}
	}

	this.previousX = this.x;
	this.previousY = this.y;

	// TODO make cursor color a setting
}

function resize() {
	resizeCanvas( windowWidth, windowHeight );
}

window.addEventListener( "leftanaloghorizontalpoll", function( e ) {
	if ( !cursor ) {
		return;
	}

	let modX = ( e.detail.current < -0.1 || e.detail.current > 0.1 ? e.detail.current : 0 ) * horizontalSpeed;
	cursor.x += modX;

	// Clamp X
	if ( cursor.x >= windowWidth - cursor.radius ) {
		cursor.x = windowWidth - cursor.radius;
	} else if ( cursor.x <= 0 + cursor.radius ) {
		cursor.x = 0 + cursor.radius;
	}
} );

window.addEventListener( "leftanalogverticalpoll", function( e ) {
	if ( !cursor ) {
		return;
	}

	let modY = ( e.detail.current < -0.1 || e.detail.current > 0.1 ? e.detail.current : 0 ) * verticalSpeed;
	cursor.y += modY;

	// Clamp Y
	if ( cursor.y >= windowHeight - cursor.radius ) {
		cursor.y = windowHeight - cursor.radius;
	} else if ( cursor.y <= 0 + cursor.radius ) {
		cursor.y = 0 + cursor.radius;
	}
} );

// Hide cursor if using auto selection
window.addEventListener( "dpadrightreleased", dpadHandler );
window.addEventListener( "dpadleftreleased", dpadHandler );
window.addEventListener( "dpaddownreleased", dpadHandler );
window.addEventListener( "dpadupreleased", dpadHandler );

function dpadHandler( e ) {
	if ( cursor && cursor.opacity > 0 ) {
		cursor.hide();
	}
}

function convertHex(hex){
    hex = hex.replace('#','');
    // R, G, B
    let output = [parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16)];
    return output;
}

window.addEventListener( "abuttonreleased", function( e ) {
	if ( $( "#osk-overlay" )[0] ) {
		return;
	}

	if ( !cursor.currentElement ) {
		return;
	}

	if ( $( cursor.currentElement ).is( "input" ) ) {
		selectedInput = cursor.currentElement;
		osk();
		return;
	}

	let href = cursor.currentElement.href;

	if ( !href ) {
		cursor.currentElement.click();
		return;
	}

	window.location.href = cursor.currentElement.href;
	window.location.reload();
} );

var oskSelected;
var selectedInput;

function osk() {
	if ( $( "#osk-overlay" )[0] ) {
		return;
	}

	cursor.hide();

	$( "body" ).append( "<div id='osk-overlay' class='overlay'></div>" );
	$( "#osk-overlay" ).append( '<div id="osk-container" class="col p-0"> <div class="row"> <textarea readonly id="osk-text"></textarea> </div> <div class="container-fluid" id="keyboard"> <div class="row key-row justify-content-center"> <div class="key" shift="~">`</div> <div class="key" shift="!">1</div> <div class="key" shift="@">2</div> <div class="key" shift="#">3</div> <div class="key" shift="$">4</div> <div class="key" shift="%">5</div> <div class="key" shift="^">6</div> <div class="key" shift="&">7</div> <div class="key" shift="*">8</div> <div class="key" shift="(">9</div> <div class="key" shift=")">0</div> <div class="key" shift="_">-</div> <div class="key" shift="+">=</div> <div class="key">backspace</div> </div> <div class="row key-row justify-content-center"> <div class="key">q</div> <div class="key">w</div> <div class="key">e</div> <div class="key">r</div> <div class="key">t</div> <div class="key">y</div> <div class="key">u</div> <div class="key">i</div> <div class="key">o</div> <div class="key">p</div> <div class="key" shift="{">[</div> <div class="key" shift="}">]</div> <div class="key" shift="|">\\</div> </div> <div class="row key-row justify-content-center"> <div class="key">a</div> <div class="key">s</div> <div class="key">d</div> <div class="key">f</div> <div class="key">g</div> <div class="key">h</div> <div class="key">j</div> <div class="key">k</div> <div class="key">l</div> <div class="key" shift=":">;</div> <div class="key" shift=\'"\'>\'</div> <div class="key">enter</div> </div> <div class="row key-row justify-content-center"> <div class="key">shift</div> <div class="key">z</div> <div class="key">x</div> <div class="key">c</div> <div class="key">v</div> <div class="key">b</div> <div class="key">n</div> <div class="key">m</div> <div class="key" shift="<">,</div> <div class="key" shift=">">.</div> <div class="key" shift="?">/</div> <div class="key">clear</div> <div class="key">close</div> </div> <div class="row key-row justify-content-center"> <div class="key space-key">______</div> </div> </div> </div>' );
	oskSelected = $( $( ".key" )[20] ).addClass( "selected" );
	$( "#osk-text" )[0].value = selectedInput.value;

	const select = function( e ) {
		let $e = $( e );

		if ( $e && !$e.hasClass( "key" ) ) {
			return;
		}

		if ( oskSelected ) {
	        oskSelected.removeClass( "selected" );
	    }
	    
	    oskSelected = $e ? $e : $( this );
	    oskSelected.addClass( "selected" );
	}
	
	let oskText = $( "#osk-text" )[0];

	const close = function() {
		window.removeEventListener( "dpadrightreleased", drr );
		window.removeEventListener( "dpadleftreleased", dlr );
		window.removeEventListener( "dpadupreleased", dur );
		window.removeEventListener( "dpaddownreleased", ddr );
		window.removeEventListener( "abuttonreleased", abr );
		window.removeEventListener( "xbuttonrelease", xb );
		window.removeEventListener( "xbuttonrelease", xb );
		window.removeEventListener( "ybuttonrelease", yb );
		window.removeEventListener( "bbuttonrelease", bb );
		window.removeEventListener( "selectbuttonrelease", sb );
		$( "#osk-overlay" ).remove();
	}

	$( ".key" ).click( select );
	$( ".key" ).click( function() {
		let txt = this.innerText.toLowerCase();

		if ( txt == "backspace" ) {
			xb();
		}

		else if ( $( this ).hasClass( "space-key" ) ) {
			yb();
		} 

		else if ( txt == "clear" ) {
			oskText.value = "";
		}

		else if ( txt == "close" ) {
			bb();
		}

		else if ( txt == "enter" ) {
			sb();
		}

		else if ( txt == "shift" ) {
			$( ".key" ).each( function( i, e ) {
				let shift = $( e ).attr( "shift" );

				if ( shift ) {
					$( e ).attr( "shift", e.innerText );
					e.innerText = shift;
				} else {
					if ( e.innerText[0] == e.innerText[0].toLowerCase() ) {
						e.innerText = e.innerText.toUpperCase();
					} else {
						e.innerText = e.innerText.toLowerCase();
					}
				}
			} );
		}

		else {
			oskText.value = oskText.value + this.innerText;
		}
	} );

	const xb = function() {
		oskText.value = oskText.value.substring( 0, oskText.value.length - 1 );
	}

	const yb = function() {
		oskText.value = oskText.value + " ";
	}

	const bb = function() {
		selectedInput.value = oskText.value;
		close();
	}

	const sb = function( e ) {
		bb();
		$( selectedInput ).closest( "form" ).submit();
		if ( e ) {
			return false;
		}
	}

	window.addEventListener( "xbuttonreleased", xb );
	window.addEventListener( "ybuttonreleased", yb );
	window.addEventListener( "bbuttonreleased", bb );

	const drr = function() {
		select( oskSelected.next() );
	};

	window.addEventListener( "dpadrightreleased", drr );

	const dlr = function() {
		select( oskSelected.prev() );
	};

	window.addEventListener( "dpadleftreleased", dlr );

	const dur = function() {
		let $par = oskSelected.parent();
		let $aboveRow = $( $par.parent().children().get( $par.index() - 1 ) );

		if ( !$aboveRow ) {
			return;
		}

		let $closestKey;

		for ( let i = 0; i < $par.children().length; i++ ) {
			$closestKey = $( $aboveRow.children().get( oskSelected.index() - i ) );
			if ( $closestKey[0] ) {
				break;
			}
		}

		select( $closestKey );
	};

	window.addEventListener( "dpadupreleased", dur );

	const ddr = function() {
		let $par = oskSelected.parent();
		let $belowRow = $( $par.parent().children().get( $par.index() + 1 ) );

		if ( !$belowRow ) {
			return;
		}

		let $closestKey;

		for ( let i = 0; i < $par.children().length; i++ ) {
			$closestKey = $( $belowRow.children().get( oskSelected.index() - i ) );
			if ( $closestKey[0] ) {
				break;
			}
		}

		select( $closestKey );
	};

	window.addEventListener( "dpaddownreleased", ddr );

	const abr = function( e ) {
		oskSelected.click();
	};

	window.addEventListener( "abuttonreleased", abr );
}