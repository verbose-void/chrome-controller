const ccSettings = new CCSettings();
$( () => ccSettings.updateSettings() );

function CCSettings() {
	this.cursor = {};
	this.scroll = {};
    this.hud = {};

	/* Default Settings */

	// Scroll
	this.scroll.multiplier = 13;
	this.scroll.sprintMultiplier = 2;

	// Cursor
	this.cursor.radius = 15;
	this.cursor.horizontalSpeed = 5;
	this.cursor.verticalSpeed = 5;
	this.cursor.idleHideMiliseconds = 5000;
	this.cursor.color = convertHex( "#000000" );
    
    // Hud
    this.hud.hidden = false;
    this.hud.size = 32;
    this.hud.position = "TOP";
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
				"cursor-color",
            
                // Hud
                "hud-hidden",
                "hud-size",
                "hud-position"
			], 

			function( results ) {
				// Scroll
				ccSettings.scroll.multiplier = results["scroll-sensitivity"] ? Number( results["scroll-sensitivity"] ) : ccSettings.scrollMultiplier;
				ccSettings.scroll.sprintMultiplier = results["scroll-sprint"] ? Number( results["scroll-sprint"] ) : ccSettings.scrollSprintMultiplier;

				// Cursor
				ccSettings.cursor.radius = results["cursor-radius"] ? Number( results["cursor-radius"] ) :  ccSettings.cursor.radius;
				ccSettings.cursor.horizontalSpeed = results["horizontal-cursor-sensitivity"] ? Number( results["horizontal-cursor-sensitivity"] ) / 3 : ccSettings.cursor.horizontalSpeed;
				ccSettings.cursor.verticalSpeed = results["vertical-cursor-sensitivity"] ? Number( results["vertical-cursor-sensitivity"] ) / 3 : ccSettings.cursor.verticalSpeed;
				ccSettings.cursor.idleHideMiliseconds = results["idle-cursor-timer"] ? Number( results["idle-cursor-timer"] ) : ccSettings.cursor.idleHideMiliseconds;
				ccSettings.cursor.color = results["cursor-color"] ? convertHex( results["cursor-color"] ) : ccSettings.cursor.color;
            
                // Hud
                ccSettings.hud.hidden = results["hud-hidden"] !== undefined ? Boolean( results["hud-hidden"] ) : ccSettings.hud.hidden;
                ccSettings.hud.size = results["hud-size"] ? Number( results["hud-size"] ) : ccSettings.hud.size;
                ccSettings.hud.position = results["hud-position"] ? results["hud-position"] : ccSettings.hud.position;
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