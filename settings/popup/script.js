var settingModders;
var mappingModders;

$( function() {
    // Add select tags to all data-mappings
    $( "td[data-mappings-type]" ).each( function() {
        let $this = $( this );
        let $sel = $this.find( "select" );
        let types = $this.attr( "data-mappings-type" ).split( "," );

        if ( !$sel.length ) {
            $sel = $this.append( "<select></select>" ).find( "select" );
        }

        types.forEach( type => {
            $sel[0].appendChild( $( "#template-" + type )[0].content.cloneNode( true ) );
        } );
    } );

	$( "#submit" ).click( () => { updateSettings(); window.close() } );
    settingModders = Array.from( $( ".setting-modifier" ) );
    mappingModders = $( "[data-button-map]" );

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
    $( "#rating-container" ).click( () => {
        chrome.tabs.create( {
                url: 'https://chrome.google.com/webstore/detail/chrome-controller/nilnjekagachinflbdkanmblmjpaimhl?hl=en-US'
            }
        );
    } );
    
    setTimeout( cycleDotAnim, 4000 );
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
	for ( let i in settingModders ) {
		let sl = settingModders[i];
		let id = sl.getAttribute( "id" );
        
		chrome.storage.sync.get( [id], function( result ) {
            if ( $( sl ).is( "[type=checkbox]" ) ) {
                if ( Boolean( result[id] ) ) {
                    $( sl ).attr( "checked", "" );
                }
            } else {
                if ( result[id] !== undefined ) {
                    sl.value = result[id];
                }
            }
            
            updateSliderDisplay( sl );
		} );
    }
    
    mappingModders.each( function() {
        let $this = $( this );

        chrome.storage.sync.get( [$this.attr( "data-button-map" )], function( res ) {
            let temp = res[$this.attr( "data-button-map" )];

            if ( temp ) {
                $this.find( "select" ).val( temp );
            } else {
                $this.find( "select" ).val( $this.attr( "data-default" ) );
            }
        } );
    } );

	chrome.storage.sync.get( ["cursor-color", "cursor-radius", "controllerPreference"], function( result ) {
		const $dot = $( "#cursor-dot" );
        $dot.css( "background-color", result["cursor-color"] );
        $dot.css( "height", Number( result["cursor-radius"] ) * 2 );
        $dot.css( "width", Number( result["cursor-radius"] ) * 2 );

        $( "." + result["controllerPreference"] ).click();
	} );
}

function updateSettings() {
	let settings = {};

	for ( let i in settingModders ) {
		let sl = settingModders[i];
        let val = sl.value;
        
        if ( $( sl ).is( "[type=checkbox]" ) ) {
            val = $( sl ).is( ":checked" );
        }
        
		settings[sl.getAttribute( "id" )] = val;
    }
    
    mappingModders.each( function() {
        let $this = $( this );
        settings[$this.attr( "data-button-map" )] = $this.find( "select" ).val();
    } );

    settings["controllerPreference"] = $( ".controller.active" ).attr( "class" ).split( " " ).filter( x => {
        return x !== "active" && x !== "controller";
    } )[0];

	chrome.storage.sync.set( settings, function() {
		chrome.tabs.query( {}, function( tabs ) {
		    for ( var i = 0; i < tabs.length; i++ ) {
		        chrome.tabs.sendMessage( tabs[i].id, { type: "settings-updated" } );
		    }
		} );
	} );

	alert( "Settings Updated!\n\n\nIf your settings don't immediately update: try submitting again, or refresh the page!" );
}

var dotAnim = {
    right: false
};

function cycleDotAnim() {
    dotAnim.right = !dotAnim.right;
    $( "#cursor-dot" ).css( "transition", "transform " + 1 / $( "#horizontal-cursor-sensitivity" )[0].value + "s ease-in" );
    
    if ( dotAnim.right ) {
        $( "#cursor-dot" ).addClass( "right" );
        setTimeout( () => $( "#cursor-dot" ).removeClass( "right" ), 1000 );
    } else {
        $( "#cursor-dot" ).addClass( "left" );
        setTimeout( () => $( "#cursor-dot" ).removeClass( "left" ), 1000 );
    }
    
    setTimeout( cycleDotAnim, 4000 );
}