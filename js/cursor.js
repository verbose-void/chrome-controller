// Add canvas overlay for cursor rendering
var canvas;
var cursor;

var horizontalSpeed = 10;
var verticalSpeed = 10;
var idleHideMiliseconds = 5000;

updateSettings();

function updateSettings() {
	chrome.storage.sync.get( ["horizontal-cursor-sensitivity", "vertical-cursor-sensitivity", "idle-cursor-timer"], function( results ) {
		horizontalSpeed = results["horizontal-cursor-sensitivity"] ? results["horizontal-cursor-sensitivity"] : horizontalSpeed;
		verticalSpeed = results["vertical-cursor-sensitivity"] ? results["vertical-cursor-sensitivity"] : verticalSpeed;
		idleHideMiliseconds = results["idle-cursor-timer"] ? results["idle-cursor-timer"] : idleHideMiliseconds;
	} );
};

chrome.runtime.onMessage.addListener( function( req ) {
	// Repeat code because updateSettings can't be used.
	if ( req.type === "settings-updated" ) {
		chrome.storage.sync.get( ["horizontal-cursor-sensitivity", "vertical-cursor-sensitivity", "idle-cursor-timer"], function( results ) {
			horizontalSpeed = results["horizontal-cursor-sensitivity"] ? results["horizontal-cursor-sensitivity"] : horizontalSpeed;
			verticalSpeed = results["vertical-cursor-sensitivity"] ? results["vertical-cursor-sensitivity"] : verticalSpeed;
			idleHideMiliseconds = results["idle-cursor-timer"] ? results["idle-cursor-timer"] : idleHideMiliseconds;
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
	fill( 0, 0, 0, this.opacity );
	ellipse( this.x, this.y, this.viewRadius, this.viewRadius );
	fill( 255, 0, 0, this.opacity );
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

window.addEventListener( "abuttonreleased", function( e ) {
	if ( !cursor.currentElement ) {
		return;
	}

	let href = cursor.currentElement.href;

	if ( !href ) {
		cursor.currentElement.click();
		return;
	}

	window.location.href = cursor.currentElement.href;
} );