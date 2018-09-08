// Add canvas overlay for cursor rendering
var canvas;
var cursor;

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
}

Cursor.prototype.update = function() {
	if ( this.isHidden !== undefined && this.isHidden ) {
		// TODO hide cursor;
		return;
	}

	ellipse( this.x, this.y, 3, 3 );
	fill( 0, 0, 0, 100 );
	ellipse( this.x, this.y, this.radius, this.radius );
	fill( 255, 0, 0, 100 );
	noStroke();

	// if position was changed from last poll
	if (   ( this.previousX && Math.abs( this.previousX - this.x ) > 0.1 )
		&& ( this.previousY && Math.abs( this.previousY - this.y ) > 0.1 ) ) {
		this.currentElement = document.elementFromPoint( this.x, this.y );
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

	// TODO make cursor speed configurable
	const speed = 10;
	let modX = ( e.detail.current < -0.1 || e.detail.current > 0.1 ? e.detail.current : 0 ) * speed;
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

	// TODO make cursor speed configurable
	const speed = 10;
	let modY = ( e.detail.current < -0.1 || e.detail.current > 0.1 ? e.detail.current : 0 ) * speed;
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