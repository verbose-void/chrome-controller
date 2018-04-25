let sliders;

$( function() {
	$( ".submit" ).click( updateSettings );
	sliders = Array.from( $( ".slider" ) );
	loadSettings();

	for ( let i in sliders ) {
		setH2( sliders[i] );
		sliders[i].oninput = setH2;
	}
} );

function setH2( slider ) {
	let t = slider.currentTarget;
	if ( t ) {
		slider = this;
	}

	let h2 = $( slider.parentElement ).children( "h2" );
	if ( h2 ) {
		let val = slider.value;

		if ( $( slider ).attr( "id" ) === "select-time" ) {
			if  ( val == 61 ) {
				val = "never";
			} else {
				val += "s";
			}
		}

		h2.text( h2.attr( "aria-label" ).replace( "%s", val )  );
	}
}

function loadSettings() {
	for ( let i in sliders ) {
		let sl = sliders[i];
		let id = sl.getAttribute( "id" );
		chrome.storage.sync.get( [id], function( result ) {
			sl.value = result[id];
			setH2( sl );
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
			settings["select-time"] = "never";
		}
	}

	chrome.storage.sync.set( settings, function() {
		chrome.tabs.query( {}, function( tabs ) {
		    for ( var i = 0; i < tabs.length; i++ ) {
		        chrome.tabs.sendMessage( tabs[i].id, { type: "settings-updated" } );
		    }
		} );
	} );
}