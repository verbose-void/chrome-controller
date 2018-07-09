let lastInputs = {};

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
	let type = message.eventType;

	if ( type === "lefttriggerpoll" ) {
		if ( message.current == 1 && lastInputs.leftTriggerLast != message.current ) {
			moveTabBy( -1 );
		}

		lastInputs.leftTriggerLast = message.current;
		return;
	}

	if ( type === "righttriggerpoll" ) {
		if ( message.current == 1 && lastInputs.rightTriggerLast != message.current ) {
			moveTabBy( 1 );
		}

		lastInputs.rightTriggerLast = message.current;
		return;
	}

	if ( type === "selectbuttonpoll" ) {
		if ( message.current == 1 && lastInputs.selectButtonLast != message.current ) {
			closeCurrentTab();
		}

		lastInputs.selectButtonLast = message.current;
		return;
	}

	if ( type === "startbuttonpoll" ) {
		if ( message.current == 1 && lastInputs.startButtonLast != message.current ) {
			openNewTab();
		}

		lastInputs.startButtonLast = message.current;
		return;
	}

	if ( type === "requestzoom" ) {
		effectCurrent( function( tab, index, id ) {
			chrome.tabs.getZoom( id, function( zoomFactor ) {
				chrome.tabs.setZoom( id, zoomFactor + message.factor / 50, function() {} )
			} );
		} );
	}
} );

// TODO move to a utils file //
function moveTabBy( amount ) {
	chrome.tabs.query( {}, function( s ) { 
		let activeIndex = -1;

		for( let i = 0; i < s.length; i++ ) {
			if ( s[i].active ) {
				activeIndex = i;
				break;
			}
		}

		if ( activeIndex >= 0 ) {
			chrome.tabs.highlight( { tabs: activeIndex + amount }, function() {} );
		}
	} );
}

function closeCurrentTab() {
	effectCurrent( function( tab, index, id ) {
		chrome.tabs.remove( id, function() {} );
	} );
}

function openNewTab() {
	chrome.tabs.create( {
			url: "https://www.google.com/webhp?hl=en&sa=X&ved=0ahUKEwjnqufjjLTaAhVpx1QKHf2BDSQQPAgD"}, 
			function() {} 
		);
}

function effectCurrent( func ) {
	chrome.tabs.query( {}, function( s ) { 
		let activeIndex = -1;

		for( let i = 0; i < s.length; i++ ) {
			if ( s[i].active ) {
				activeIndex = i;
				break;
			}
		}
		if ( activeIndex >= 0 ) {
			// tab, tab index, tab id
			func( s[activeIndex], activeIndex, s[activeIndex].id );
		}
	} );
}
// ************************* //