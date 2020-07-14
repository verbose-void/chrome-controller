var cursor;
var hud;

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

    buttons.load();
}

function draw() {
    clear();
    if ( cursor.draw && hud.draw ) {
        cursor.draw();
        hud.draw();
    }

    if ( frameCount % 60 === 0 ) {
        buttons.updateCurrentScheme();
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
    fill( ccSettings.cursor.color[ 0 ], ccSettings.cursor.color[ 1 ], ccSettings.cursor.color[ 2 ], this.opacity );
    ellipse( this.x, this.y, this.viewRadius );
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
        const r = e[ 0 ].getBoundingClientRect();
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

    if ( this.keyboard && !$elem.is( ".ccosk-key" ) ) {
        return;
    }

    // If text input, open keyboard
    if ( $elem.is( "textarea, input[type=url], input[type=text], input#search" ) ) {
        this.keyboard = new Keyboard( $elem );
        return;
    }

    if ( $elem ) {
        if ( $elem[ 0 ].href ) {
            window.location.href = $elem[ 0 ].href;
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

    show( this );
    this.initHide = setTimeout( () => hide( hud ), 4000 );
    this.draw();
}

Hud.prototype.draw = function() {
    if ( !buttons.loaded || ccSettings.hud.hidden ) {
        return;
    }

    const pos = ccSettings.hud.position;
    const size = ccSettings.hud.size;
    let cur;
    let temp;
    let temp2;
    let scheme = buttons.currentScheme;
    let len = scheme.length;
    let x = windowWidth / 2 - ( len * ( size * 1.1 ) / 2 );
    let y = size / 2 * 1.1;

    let textHidden = ccSettings.hud.hideText;

    textSize( size / 5 );
    textAlign( CENTER );
    fill( ccSettings.hud.color[ 0 ], ccSettings.hud.color[ 1 ], ccSettings.hud.color[ 2 ], this.opacity );
    for ( let i in scheme ) {
        cur = scheme[ i ];

        // Only one item in this object at any given time.
        for ( let actionName in cur ) {
            let img = cur[ actionName ];

            if ( pos === "BOTTOM" ) {
                y = windowHeight - ( size / 2 + 5 );
                image( img, x, y, size, size );
                if ( !textHidden ) {
                    text( actionName, x - size / 4, y - size, size / 2, size );
                }
            } else if ( pos === "LEFT" ) {
                temp = x - windowWidth / 2 + windowHeight / 2;
                image( img, y, temp, size, size );
                if ( !textHidden ) {
                    textAlign( LEFT );
                    text( actionName, y + size / 2 + 5, temp + 2 );
                }
            } else if ( pos === "RIGHT" ) {
                temp = x - windowWidth / 2 + windowHeight / 2;
                temp2 = windowWidth - y - size / 4;
                image( img, temp2, temp, size, size );
                if ( !textHidden ) {
                    textAlign( RIGHT );
                    text( actionName, temp2 - size / 2 - 5, temp + 2 );
                }
            } else {
                image( img, x, y, size, size );
                if ( !textHidden ) {
                    text( actionName, x - size / 4, y + size / 2, size / 2, size );
                }
            }

            x += size * 1.1;
            tint( 255, this.opacity );
        }
    }
}