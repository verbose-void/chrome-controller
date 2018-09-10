$( function() {
	$( "#submit" ).click( updateSettings );
	sliders = Array.from( $( ".slider" ) );
	sliders = sliders.concat( Array.from( $( ".color-picker" ) ) );
	loadSettings();
} );

function loadSettings() {
	for ( let i in sliders ) {
		let sl = sliders[i];
		let id = sl.getAttribute( "id" );
		chrome.storage.sync.get( [id], function( result ) {
			sl.value = result[id];
		} );
	}
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