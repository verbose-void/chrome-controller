$( function() {
	$( "#submit" ).click( updateSettings );
	sliders = Array.from( $( ".slider" ) );
	sliders = sliders.concat( Array.from( $( ".color-picker" ) ) );
    
    const $dot = $( "#cursor-dot" );
    
    $( "#cursor-color" ).on( "change", function( e ) {
        $dot.css( "background-color", e.target.value );
    } );
    
    $( "#cursor-radius" ).on( "change", ( e ) => {
        $dot.css( "width", e.target.value * 2 );
        $dot.css( "height", e.target.value * 2 );
    } );
    $( ".slider" ).on( "change", e => updateSliderDisplay( e.currentTarget ) );
    $( ".slider" ).each( ( i, e ) => updateSliderDisplay( e ) );
    
	loadSettings();
} );

function updateSliderDisplay( elem ) {
    const $this = $( elem );
    const $lb = $this.prev();
    if ( !$lb.hasClass( "range-display" ) ) {
        return;
    }
    const fm = $this.attr( "format-mult" );
    const val = fm == null ? $this[0].value : ( $this[0].value * Number.parseFloat( fm ) ).toFixed( 1 );
    const form = $this.attr( "format" );
    $lb.text( form ? form.replace( "%val%", val ) : val );
}

function loadSettings() {
	for ( let i in sliders ) {
		let sl = sliders[i];
		let id = sl.getAttribute( "id" );
		chrome.storage.sync.get( [id], function( result ) {
			sl.value = result[id];
            updateSliderDisplay( sl );
		} );
	}
    
    $( () => {
        $( "#cursor-color" ).trigger( "change" );
        $( "#cursor-radius" ).trigger( "change" );
    } );
}

function updateSettings() {
	let settings = {};

	for ( let i in sliders ) {
		let sl = sliders[i];
		settings[sl.getAttribute( "id" )] = sl.value;
	}

	if ( settings["select-time"] ) {
		if ( settings["select-time"] == 61 ) {
			settings["select-time"] = "forever";
		}
	}

	chrome.storage.sync.set( settings, function() {
		chrome.tabs.query( {}, function( tabs ) {
		    for ( var i = 0; i < tabs.length; i++ ) {
		        chrome.tabs.sendMessage( tabs[i].id, { type: "settings-updated" } );
		    }
		} );
	} );

	alert( "Settings Updated!" );
}