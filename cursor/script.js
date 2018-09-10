var cursor;

function resize() {
	resizeCanvas( windowWidth, windowHeight );
}

function setup() {
 	createCanvas( windowWidth, windowHeight );
	$( "#defaultCanvas0" ).addClass( "cctrl-canvas" );
	$( window ).resize( resize ).resize();
	ellipseMode( RADIUS );

	cursor = new Cursor( windowWidth / 2, windowHeight / 2 );
	window.addEventListener( "leftanaloghorizontalpoll", e => cursor.updatePos( e.detail.current, 0 ), true );
	window.addEventListener( "leftanalogverticalpoll", e => cursor.updatePos( 0, e.detail.current ), true );
	window.addEventListener( "abuttonreleased", () => { cursor.click() }, true );
	window.addEventListener( "rightanalogverticalpoll", () => { cursor.maintainCenter() }, true );
}

function draw() {
	clear();
	if ( cursor.draw ) {
		cursor.draw();
	}
}

function Cursor( x, y ) {
	this.x = x;
	this.y = y;

	this.viewRadius = 0;

	this.maxOpacity = 200;
	this.opacity = 0;
}

Cursor.prototype.show = function( curs ) {
	if ( !curs ) {
		curs = this;
	}

	if ( curs.viewRadius < ccSettings.cursor.radius ) {
		curs.viewRadius = curs.viewRadius == 0 ? 3 : curs.viewRadius * 1.1;
	} else {
		curs.viewRadius = ccSettings.cursor.radius;
	}

	if ( curs.opacity < curs.maxOpacity ) {
		curs.opacity = curs.opacity == 0 ? 5 : curs.opacity * 1.2;
		setTimeout( () => curs.show(), 10 );
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
		setTimeout( () => curs.hide(), 10 );
	} else {
		curs.opacity = 0;
	}
}

Cursor.prototype.draw = function() {
	noStroke();
	ellipse( this.x, this.y, this.viewRadius );
	fill( ccSettings.cursor.color[0], ccSettings.cursor.color[1], ccSettings.cursor.color[2], this.opacity );
}

Cursor.prototype.updatePos = function( x, y ) {
	const dx = ( x < 0.1 && x > -0.1 ? 0 : x ) * ccSettings.cursor.horizontalSpeed;
	const dy = ( y < 0.1 && y > -0.1 ? 0 : y ) * ccSettings.cursor.verticalSpeed;
	this.x += dx;
	this.y += dy;

	if ( dx !== 0 || dy !== 0 ) {
		this.isCentered = false;

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
				if ( this.lastIdle && new Date().getTime() - this.lastIdle.getTime() > ccSettings.cursor.idleHideMiliseconds ) {
					if ( !this.isCentered ) {
						this.hide();
					}
				}
			}

			this.moved = false;
		}
	}

	// Clamp X
	if ( this.x - ccSettings.cursor.radius < 0 ) {
		this.x = ccSettings.cursor.radius;
		this.isCentered = false;
	} else if ( this.x + ccSettings.cursor.radius > windowWidth ) {
		this.x = windowWidth - ccSettings.cursor.radius;
		this.isCentered = false;
	}

	// Clamp Y
	if ( this.y - ccSettings.cursor.radius < 0 ) {
		this.y = ccSettings.cursor.radius;
		this.isCentered = false;
	} else if ( this.y + ccSettings.cursor.radius > windowHeight ) {
		this.y = windowHeight - ccSettings.cursor.radius;
		this.isCentered = false;
	}
}

Cursor.prototype.centerOverElement = function( e ) {
	if ( e ) {
		cursor.show();
		e = $( e );
		this.$centered = e;
		this.isCentered = true;
		const r = e[0].getBoundingClientRect();
		this.x = r.x + ( r.width / 2 );
		this.y = r.y + ( r.height / 2 );
	}
}

Cursor.prototype.maintainCenter = function() {
	if ( this.isCentered ) {
		this.centerOverElement( this.$centered );
	}
}

Cursor.prototype.click = function() {
	this.isCentered = false;

	let $elem = $( document.elementFromPoint( this.x, this.y ) );

	// If text input, open keyboard
	if ( $elem.is( "textarea, input[type=url], input[type=text], input#search" ) ) {
		this.keyboard = new Keyboard( $elem );
		return;
	}

	if ( $elem ) {
		if ( $elem[0].href ) {
			window.location.href = $elem[0].href;
		} else {
			$elem.click();
		}
	}
}

// Show cursor when settings are updated
chrome.runtime.onMessage.addListener( ( req ) => {
    if ( req.type === "settings-updated" ) {
        cursor.hide();
        setTimeout( cursor.show, 100 );
    }
} );