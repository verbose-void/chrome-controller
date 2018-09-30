let cooldowns = {};
const ACTION_COOLDOWN_TIME = 200;
var keyboardOpen = false;

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
	if ( isValid( message, "movetabright" ) ) {
		moveTabBy( 1, sender.tab.windowId );
	}

	else if ( isValid( message, "movetableft" ) ) {
		moveTabBy( -1, sender.tab.windowId );
	}

	else if ( isValid( message, "opennewtab" ) ) {
		openNewTab();
	}

	else if ( isValid( message, "closecurrenttab" ) ) {
		closeCurrentTab();
	}

	else if ( message.eventType === "openkeyboard" ) {
		keyboardOpen = true;
	}

	else if ( message.eventType === "closekeyboard" ) {
		keyboardOpen = false;
	}
} );

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

function isValid( message, type ) {
	if ( keyboardOpen ) {
		return false;
	}
	return message.eventType === type && !isOnCooldown( message.eventType );
}

function moveTabBy( amount, windowID ) {
	chrome.tabs.query( { windowId: windowID }, function( s ) { 
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