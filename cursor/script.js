var cursor;
var hud;
var deltaTime;
var prevFrame;

function resize() {
	resizeCanvas( windowWidth, windowHeight );
}

function setup() {
 	createCanvas( windowWidth, windowHeight );
	$( "#defaultCanvas0" ).addClass( "cctrl-canvas" );
	$( window ).resize( resize ).resize();

	ellipseMode( RADIUS );
	imageMode( CENTER );

	cursor = new Cursor( windowWidth / 2, windowHeight / 2 );
	hud = new Hud();
	prevFrame = performance.now();
	deltaTime = 0;

	window.addEventListener( "leftanaloghorizontalpoll", e => {
		deltaTime = prevFrame - performance.now();
		prevFrame = performance.now();
		cursor.updatePos( e.detail.current, 0, deltaTime );
	}, true );
	window.addEventListener( "leftanalogverticalpoll", e => cursor.updatePos( 0, e.detail.current, deltaTime ), true );
	window.addEventListener( "abuttonreleased", () => { cursor.click() }, true );
	window.addEventListener( "rightanalogverticalpoll", () => { cursor.maintainCenter() }, true );
}

function draw() {
	clear();
	if ( cursor.draw && hud.draw ) {
		cursor.draw();
		hud.draw();
	}
}

function Cursor( x, y ) {
	this.x = x;
	this.y = y;

	this.viewRadius = 0;

	this.maxOpacity = 200;
	this.opacity = 0;
}

function show( curs ) {
	if ( curs.viewRadius < ccSettings.cursor.radius ) {
		curs.viewRadius = curs.viewRadius == 0 ? 3 : curs.viewRadius * 1.1;
	} else {
		curs.viewRadius = ccSettings.cursor.radius;
	}

	if ( curs.opacity < curs.maxOpacity ) {
		curs.opacity = curs.opacity == 0 ? 5 : curs.opacity * 1.2;
		setTimeout( () => show( curs ), 10 );
	} else {
		curs.opacity = curs.maxOpacity;
	}
}

function hide( curs ) {
	curs.lastIdle = null;

	if ( curs.viewRadius > 5 ) {
		curs.viewRadius *= 0.9;
	} else {
		curs.viewRadius = 3;
	}

	if ( curs.opacity > 10 ) {
		curs.opacity *= 0.8;
		setTimeout( () => hide( curs ), 10 );
	} else {
		curs.opacity = 0;
	}
}

Cursor.prototype.draw = function() {
	noStroke();
	ellipse( this.x, this.y, this.viewRadius );
	fill( ccSettings.cursor.color[0], ccSettings.cursor.color[1], ccSettings.cursor.color[2], this.opacity );
}

Cursor.prototype.updatePos = function( x, y, dt ) {
	const dx = ( x < 0.1 && x > -0.1 ? 0 : x ) * ccSettings.cursor.horizontalSpeed * -dt;
	const dy = ( y < 0.1 && y > -0.1 ? 0 : y ) * ccSettings.cursor.verticalSpeed * -dt;
	this.x += dx;
	this.y += dy;

	if ( dx !== 0 || dy !== 0 ) {
		this.isCentered = false;

		if ( this.opacity < 1 ) {
			show( this );
			show( hud );

			if ( hud.initHide ) {
				clearTimeout( hud.initHide );
				hud.initHide = null;
			}
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
						hide( this );
						hide( hud );
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
		show( cursor );
		show( hud );
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
        hide( cursor );
        hide( hud );
    }
} );

/* Hud Stuff ( Same File Cus P5js ) */

function Hud( active ) {
	this.maxOpacity = 180;
	this.opacity = 0;

	if ( active ) {
		this.active = active;
	} else {
		this.active = {
			"ls": {
				x: -1,
				image: loadImage( "data:image/png;base64,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" )
			},
			"rs": {
				x: 1,
				image: loadImage( "data:image/png;base64,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" )
			},
			"a": {
				x: 0,
				image: loadImage( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAAB2JJREFUWMOdl12IXVcVx39r7X3uuR9z507mzkcziZgoTaXkSWp9qJWmRchTlaJQKCWtbwXFYqpU8FGwYCsVi/qWSF8EsahP7UOTYi1Iq0+WYlPUfs50ZjrJZGbu1zln7+XDOXPvnTZpixuGgXvWXl////rvvYVPWLfdvQCGRziBcRdwCjgJHAaalVkfWANeBS4iPI9xCaF46c8ffKx/ud6H27++AOAMbgEexDgNHAH8J+RcAO8hPAucE/g7EF7807UT+UgCt3+ji4gAtmImDwMPAIsAZgYYIKgqqg6AGAMxxvG3cj8Am8B5EXsSZNXMePGPW9dP4Kv3dMFAhFsNnsC4rbQpHTcbbbqHlpmfW2am1aGWpABk+Yi93lUub6+zdWWd/mB3nAxgCC8JnMV42QT+8szWRxO445tlcOBO4NcGJ8ovxkxzjs+s3MjK8jFajdlx5UyHAUIM9Ps7rG68yTurb7DX3x5/FbgEPARcAHjhD1uTBE59q7vv71bgaeCEGagqNywe49jRm2k12mW7zUoozDCbaqUIIiCqCNAb7PDmu6/x/uZbxBipULkE3A+8DHDx91sloaqCVsx4nKpyr44jyydYWf4cTpXBcA+LRoiRGGOFu1XBQcWhTnHqUBWcOo4dvZlaUue99UuEGKh8Py7CvcAqgHztvi4ipjHKYxg/2K/m8MLnWep+FhEpKzUjhEhe5Mwf2SZtZVhknEA28Gy+3cG7GkniEJVqr7G+9Rbvf/DvisSA8DNVe9RMohcxBG5VtTP77ezMLNFpL5Dlg3GLY4iMRgFN+tQ72/jEmEIArQmBwGC3RaOZ4LyOp2GuvcAw2+Hq3vq++RmBZxD7m/cJLkbOiLEEkPiUTmuBvBhNiGZGKCKDfs78kV2KkJEXH5pngbS9w5XNCJKSpB7VyZDNthYYZtv7fpcQzjjlFQ/cpMrpfcNmfQ4D8mI4qT4a2ShQxCHpTJ/RKF5DQoy0XRAF+oNAXRKcUyaSIDTrHXYHG/s/nAZu8uq4C+MogKon8SlFmAQ3gxAiw2FBszNAfU6ec80lDhqzQ65ugvqAT/RAFxJfx3tPjAXAUYQ7vSp3AB4MrwlmkSKMDiSQZ4Ei5LTmRoQQMSuJunslIAIzcw4zQwRahyJb61Z2SRzqDnbKu4RCckA8cMqrs5NjIokSLDuwIQYjywI+zUnqBUU+wfy/r41wCXzhi+lYE2p1SJvGcGCo93gRpnAoJbwSSOCkV+XwBCUwyyfsNqMIRhECnbkCEYix9DfsGxurBd7D8ZsTfE32ZZz2fEHvLSMvIuIU0bEaVpoxzuewV0drqtwDCZgZRRFRH2i2IcbJzsubBdkwUji4uhXo3uCoBJJm2/C1nDyPuMThtFRJM0ACqmM3LVVXKqE6EI2gBaIFSEGkIISCVsfwiUzlaay/nWNEYjQ23suxOFEFnwjtQ0ZR5MSYY5T+St+R6ZjeeesBbYBIAVHH5It5RNSYnUtQlYp8MMoM52FxxbEPcYhSJlnZdLrK1csZIVrJA5VycDWifpxsz6tjbT8BIWKxDC7BiDHSbDvqzUkggLTuOPnlCXIluaaIBDSajpmO0u8VgCs7LIJoRCaH6Zp3jlepDiBTI4aImRFjOVZz3YSk5iY6/imXiDC/mNDv5RgBUUGdoM6mh+KfXh0XEe4GPGaoGiGAYdRbjtm52sFZroh27aAcEMjZQzWaH4wIsUCc4hIrO1XaFBgveHV2QYR3gOPAGAKIzC/MkNaTqeDGf/61x9bGkCQVtMI1mlFkML+YcvymmTFWUoPuUoP1tR1EIs4JU3eZd8y4oCK8ro7nppmJGGnq6S40SVNPreZJU08IwtrbPfq9EVmWkRcj8pCR5RmDwYiNtQFmOt5Tq3kWl5vUG75USmV6Ap4T4XXvawTgtyLcg7EUK7ItLM0w22kcaO/77w7QJNJdctRbik+qCQgw6hv93cCgV3BovjGGqV6HxeUZLl/eRtVQJ4iwYcZ5dQSvDmLgZXWcB35IgKQm1BsJvb2MUEyuXlcu95jtCjNzSr0hqC/hjBFqKagztq/0ac3UxnucE5otz15fUW+4EoLzIfKKakWH7/y8A7AiYr+LkduLHLIhDHtGNjRiqESjZtSbQtoUkkQQZSzPoYDRwBj2jHwEoTBEhCSFtCmkDSre8CLIvcDqU9+/Wt4JnY9gsgo8osrTqpxQNXxSOjYDUfC+bLtLBNWJLqiBq7BNUiHkNpZtdeAT8DXBKZeARxBbLTKblg14+JezOA8xcArhN2acmExExQMtDxKZaPmBZVZOUYwHR7P6u2TGQ7W6XOjvRJ46u3swAYCzv5rF1SAWfAnhCYGvfNjm+o+5iU5M/aM6g/5K5GytIa/0d40nv7tzfXePnpulvEGzIsL3RHiQ6mn2f6xNM85h/MJgVRUe+/bOAYPr1vOj820wHMItIjwgcBrhKJ/mcWq8a/CsGeeAfwDhpw/sXtP4kxrKj59uUwW9EeEugVPI+Hm+fyL1gDWMVw0uYjwPvAEUP7l/92P9/w8B+UEzbt0+lwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wOS0xMlQwMTo0Mjo1OCswMjowMKXD+IAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDktMTJUMDE6NDI6NTgrMDI6MDDUnkA8AAAAAElFTkSuQmCC" )
			},
			"rb": {
				x: 2,
				image: loadImage( "data:image/png;base64,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" )
			},
			"lb": {
				x: -2,
				image: loadImage( "data:image/png;base64,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" )
			}
		};
	}

	show( this );
	this.initHide = setTimeout( () => hide( hud ), 4000 );
	this.draw();
}

Hud.prototype.draw = function() {
	const pos = ccSettings.hud.position;
	let cur;
	let x;
	let y;
	let temp;

	for ( let i in this.active ) {
		cur = this.active[i];
		// Scale for size
		x = windowWidth / 2 + cur.x * ccSettings.hud.size * 1.1;
		y = ccSettings.hud.size / 2 + 5;

		if ( pos === "BOTTOM" ) {
			y = windowHeight - ( ccSettings.hud.size / 2 + 5 );
		} else if ( pos === "LEFT" ) {
			temp = x;
			x = y;
			y = temp - windowWidth / 2 + windowHeight / 2;
		} else if ( pos === "RIGHT" ) {
			temp = x;
			x = windowWidth - y;
			y = temp - windowWidth / 2 + windowHeight / 2;
		}

		image( cur.image, x, y, ccSettings.hud.size, ccSettings.hud.size );
		tint( 255, this.opacity );
	}
}