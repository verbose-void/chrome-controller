let leftTriggerLast = 0;
let rightTriggerLast = 0;

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
	let type = message.eventType;

	if ( type === "lefttriggerpoll" ) {
		if ( message.current == 1 && leftTriggerLast != message.current ) {
			moveTabBy( -1 );
		}

		leftTriggerLast = message.current;
		return;
	}

	if ( type === "righttriggerpoll" ) {
		if ( message.current == 1 && rightTriggerLast != message.current ) {
			moveTabBy( 1 );
		}

		rightTriggerLast = message.current;
		return;
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
// ************************* //