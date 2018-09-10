const ccSettings = new CCSettings();
$( () => ccSettings.updateSettings() );

function CCSettings() {
	this.cursor = {};
	this.scroll = {};

	/* Default Settings */

	// Scroll
	this.scroll.multiplier = 13;
	this.scroll.sprintMultiplier = 2;

	// Cursor
	this.cursor.radius = 15;
	this.cursor.horizontalSpeed = 10;
	this.cursor.verticalSpeed = 10;
	this.cursor.idleHideMiliseconds = 5000;
	this.cursor.color = convertHex( "#000000" );
}

CCSettings.prototype.updateSettings = function( req ) {
	if ( !req || req.type === "settings-updated" ) {
		chrome.storage.sync.get( [
				// Scroll
				"scroll-sensitivity", 
				"scroll-sprint", 

				// Cursor
				"cursor-radius",
				"horizontal-cursor-sensitivity", 
				"vertical-cursor-sensitivity", 
				"idle-cursor-timer",
				"cursor-color"
			], 

			function( results ) {
				// Scroll
				ccSettings.scroll.multiplier = results["scroll-sensitivity"] ? results["scroll-sensitivity"] : ccSettings.scrollMultiplier;
				ccSettings.scroll.sprintMultiplier = results["scroll-sprint"] ? results["scroll-sprint"] : ccSettings.scrollSprintMultiplier;

				// Cursor
				ccSettings.cursor.radius = results["cursor-radius"] ? results["cursor-radius"] : ccSettings.cursor.radius;
				ccSettings.cursor.horizontalSpeed = results["horizontal-cursor-sensitivity"] ? results["horizontal-cursor-sensitivity"] : ccSettings.cursor.horizontalSpeed;
				ccSettings.cursor.verticalSpeed = results["vertical-cursor-sensitivity"] ? results["vertical-cursor-sensitivity"] : ccSettings.cursor.verticalSpeed;
				ccSettings.cursor.idleHideMiliseconds = results["idle-cursor-timer"] ? results["idle-cursor-timer"] : ccSettings.cursor.idleHideMiliseconds;
				ccSettings.cursor.color = results["cursor-color"] ? convertHex( results["cursor-color"] ) : ccSettings.cursor.color;
			} );
	}
};

chrome.runtime.onMessage.addListener( ccSettings.updateSettings );

function convertHex( hex ){
    hex = hex.replace( "#", "" );
    //                                  R                                      G                                     B
    let output = [parseInt( hex.substring( 0, 2 ), 16 ), parseInt( hex.substring( 2,4 ), 16 ), parseInt( hex.substring( 4, 6 ), 16 )];
    return output;
}