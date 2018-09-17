function Keyboard( inp ) {
	if ( $( "#ccosk-container" )[0] ) {
		return;
	}

	if ( buttons.controllerType() === "PS" ) {
		buttons.currentScheme = buttons.schemes.keyboard.ps;
	} else {
		buttons.currentScheme = buttons.schemes.keyboard.xbox;
	}

	chrome.runtime.sendMessage( { eventType: "openkeyboard" } );

	this.$text = $( inp )[0];
	const _this = this;

	$( "body" ).prepend( '<div id="ccosk-container"> <div id="ccosk-text-container"> <textarea readonly id="ccosk-text"></textarea> </div> <div id="ccosk-keyboard"> <div class="ccosk-key-row"> <div class="ccosk-key" shift="~">`</div> <div class="ccosk-key" shift="!">1</div> <div class="ccosk-key" shift="@">2</div> <div class="ccosk-key" shift="#">3</div> <div class="ccosk-key" shift="$">4</div> <div class="ccosk-key" shift="%">5</div> <div class="ccosk-key" shift="^">6</div> <div class="ccosk-key" shift="&">7</div> <div class="ccosk-key" shift="*">8</div> <div class="ccosk-key" shift="(">9</div> <div class="ccosk-key" shift=")">0</div> <div class="ccosk-key" shift="_">-</div> <div class="ccosk-key" shift="+">=</div> <div class="ccosk-key">backspace</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">q</div> <div class="ccosk-key">w</div> <div class="ccosk-key">e</div> <div class="ccosk-key">r</div> <div class="ccosk-key">t</div> <div class="ccosk-key">y</div> <div class="ccosk-key">u</div> <div class="ccosk-key">i</div> <div class="ccosk-key">o</div> <div class="ccosk-key">p</div> <div class="ccosk-key" shift="{">[</div> <div class="ccosk-key" shift="}">]</div> <div class="ccosk-key" shift="|">\\</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">a</div> <div class="ccosk-key">s</div> <div class="ccosk-key">d</div> <div class="ccosk-key">f</div> <div class="ccosk-key">g</div> <div class="ccosk-key">h</div> <div class="ccosk-key">j</div> <div class="ccosk-key">k</div> <div class="ccosk-key">l</div> <div class="ccosk-key" shift=":">;</div> <div class="ccosk-key" shift=\'"\'>\'</div> <div class="ccosk-key">enter</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key">shift</div> <div class="ccosk-key">z</div> <div class="ccosk-key">x</div> <div class="ccosk-key">c</div> <div class="ccosk-key">v</div> <div class="ccosk-key">b</div> <div class="ccosk-key">n</div> <div class="ccosk-key">m</div> <div class="ccosk-key" shift="<">,</div> <div class="ccosk-key" shift=">">.</div> <div class="ccosk-key" shift="?">/</div> <div class="ccosk-key">clear</div> <div class="ccosk-key">close</div> </div> <div class="ccosk-key-row"> <div class="ccosk-key space-key">______</div> </div> </div> </div>' );

	$( ".ccosk-key" ).click( function( e ) {
		let $this = $( this );
	    $this.addClass( "ccosk-selected" );
	    setTimeout( () => $this.removeClass( "ccosk-selected" ), 100 );
	} );

	hide( cursor );
	hide( hud );

	$( "#ccosk-text" )[0].value = this.$text.value;

	const select = function( e ) {
		cursor.centerOverElement( this );
	}
	
	let oskText = $( "#ccosk-text" )[0];

	$( ".ccosk-key" ).click( select );
	$( ".ccosk-key" ).click( function() {
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
			$( ".ccosk-key" ).each( function( i, e ) {
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
		_this.$text.value = oskText.value;
		_this.close();
	}

	const sb = function( e ) {
		bb();
		$( _this.$text ).closest( "form" ).submit();
		if ( e ) {
			return false;
		}
	}

	window.addEventListener( "selectbuttonreleased", () => oskText.value = "" );
	window.addEventListener( "startbuttonreleased", sb );
	window.addEventListener( "xbuttonreleased", xb );
	window.addEventListener( "ybuttonreleased", yb );
	window.addEventListener( "bbuttonreleased", bb );
}

Keyboard.prototype.close = function() {
	$( "#ccosk-container" ).remove();
	cursor.keyboard = null;
	chrome.runtime.sendMessage( { eventType: "closekeyboard" } );
	buttons.updateControllerScheme();
}

window.addEventListener( "unload", () => chrome.runtime.sendMessage( { eventType: "closekeyboard" } ) );