let cooldowns = {};
const ACTION_COOLDOWN_TIME = 500;

function isOnCooldown( action ) {
	if ( cooldowns[action] === undefined ) {
		cooldowns[action] = new Date().getTime();
		return false;
	}

	if ( new Date().getTime() - cooldowns[action] > ACTION_COOLDOWN_TIME ) {
		cooldowns[action] = new Date().getTime();
		return false;
	}

	return true;
}

function isValid( type, type0 ) {
	return type === type0 && !isOnCooldown( type );
}

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
	let type = message.eventType;

	if ( isValid( type, "righttriggermaxpull" ) ) {
		moveTabBy( 1 );
	}

	else if ( isValid( type, "lefttriggermaxpull" ) ) {
		moveTabBy( -1 );
	}

	else if ( isValid( type, "startbuttonreleased" ) ) {
		openNewTab();
	}

	else if ( isValid( type, "selectbuttonreleased" ) ) {
		closeCurrentTab();
	}

	else if ( type === "requestzoom" ) {
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
		console.log( tab, index, id );
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