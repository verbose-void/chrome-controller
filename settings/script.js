const defaultAction = { "run": function() {}, "map": "" };
var cursorMoveDelta;

function press( sel ) {
	let $s = $( sel );
	if ( $s[0] ) {
		$s.click();
	}
}

// Define Action Handlers
const actions = {
	"scroll": {
		...defaultAction,

		"run": function( e ) {
			if ( e.detail.axis !== 1 && e.detail.axis !== 3 && e.detail.axis ) {
				return;
			}

			const am = e.detail.current < 0.1 && e.detail.current > -0.1 ? 0 : e.detail.current * ccSettings.scroll.multiplier;
			if ( am !== 0 ) {
				let pressed = e.detail.axis <= 1 ? e.detail.controller.buttons[10].pressed : e.detail.controller.buttons[11].pressed;
				window.scrollBy( 0, pressed ? am * ccSettings.scroll.sprintMultiplier : am );
			}

			try {
				cursor.maintainCenter();
			} catch ( er ) {}
		}
	},

	"moveCursor": { 
		...defaultAction,

		"run": function( e ) {
			if ( actions.eventToControlMap[e.type] === "dpad" ) {
				cursorMoveDelta = prevFrame - performance.now();
				prevFrame = performance.now();

				cursor.updatePos( 
					e.detail.controller.buttons[14].value <= 0 ? e.detail.controller.buttons[15].value : -e.detail.controller.buttons[14].value, 
					e.detail.controller.buttons[12].value <= 0 ? e.detail.controller.buttons[13].value : -e.detail.controller.buttons[12].value, 
					cursorMoveDelta );

				return;
			}

			try {
				if ( e.detail.axis === 1 || e.detail.axis === 3 ) { 
					// Delta only calculated once.
					cursorMoveDelta = prevFrame - performance.now();
					prevFrame = performance.now();

					// Vertical
					cursor.updatePos( 0, e.detail.current, cursorMoveDelta );
				} else {
					// Horizontal
					cursor.updatePos( e.detail.current, 0, cursorMoveDelta );
				}
			} catch ( err ) {}
		}
	},

	"click": { 
		...defaultAction,

		"run": function() {
			try {
				cursor.click();
			} catch ( err ) {}
		}
	},

	"videoScreenSize": { 
		...defaultAction,

		"run": function() {
			press( ".ytp-size-button.ytp-button" );
		}
	},

	"videoPlayPause": { 
		...defaultAction,

		"run": function() {
			press( ".ytp-play-button.ytp-button" );
		}
	},

	"videoDisplayTime": { 
		...defaultAction,

		"run": function() {
			$( "div .html5-video-player" ).toggleClass( "ytp-autohide" );
		}
	},

	"newTab": { 
		...defaultAction,

		"run": function() {
			chrome.runtime.sendMessage( { eventType: "opennewtab" } );
		}
	},

	"closeTab": { 
		...defaultAction,

		"run": function() {
			chrome.runtime.sendMessage( { eventType: "closecurrenttab" } );
		}
	},

	"historyBack": { 
		...defaultAction,

		"run": function() {
			window.history.back();
		}
	},

	"historyForward": { 
		...defaultAction,

		"run": function() {
			window.history.forward();
		}
	},

	"tabLeft": { 
		...defaultAction,

		"run": function() {
			chrome.runtime.sendMessage( { eventType: "movetableft" } );
		}
	},

	"tabRight": { 
		...defaultAction,

		"run": function() {
			chrome.runtime.sendMessage( { eventType: "movetabright" } );
		}
	},

	// Keyboard Actions

	"close": {
		...defaultAction,

		"run": function() {
			cursor.keyboard.bb();
		}
	},

	"backspace": {
		...defaultAction,

		"run": function() {
			cursor.keyboard.xb();
		}
	},

	"space": {
		...defaultAction,

		"run": function() {
			cursor.keyboard.yb();
		}
	},

	"clear": {
		...defaultAction,

		"run": function() {
			$( "#ccosk-text" )[0].value = "";
		}
	},

	"enter": {
		...defaultAction,

		"run": function() {
			cursor.keyboard.sb();
		}
	},

	"map": {}
};

actions.eventToControlMap = {
	"rightanalogverticalpoll": "rightstick",
	"rightanaloghorizontalpoll": "rightstick",
	"leftanalogverticalpoll": "leftstick",
	"leftanaloghorizontalpoll": "leftstick",
	"dpaduppressed": "dpad",
	"dpaduphold": "dpad",
	"dpaddownpressed": "dpad",
	"dpaddownhold": "dpad",
	"dpadrightpressed": "dpad",
	"dpadrighthold": "dpad",
	"dpadleftpressed": "dpad",
	"dpadlefthold": "dpad",
	"lefttriggerreleased": "lt",
	"righttriggerreleased": "rt",
	"leftbumperreleased": "lb",
	"rightbumperreleased": "rb",
	"abuttonreleased": "a",
	"bbuttonreleased": "b",
	"xbuttonreleased": "x",
	"ybuttonreleased": "y",
	"startbuttonreleased": "menu",
	"selectbuttonreleased": "view",
}

const ccSettings = new CCSettings();

$( () => ccSettings.updateSettings() );

function CCSettings() {
	this.cursor = {};
	this.scroll = {};
	this.hud = {};
	this.cmap = {};

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
    this.hud.size = 64;
	this.hud.position = "TOP";
	
	// Control Mapping (Context of XBOX Controller)

	/* Axis */
	actions.map.rightstick = "scroll";
	actions.map.leftstick = "moveCursor";

	/* Buttons */
	actions.map.dpad = "autoCursorSelect";
	actions.map.a = "click";
	actions.map.b = "videoScreenSize";
	actions.map.x = "videoPlayPause";
	actions.map.y = "videoDisplayTime";
	actions.map.menu = "newTab";
	actions.map.view = "closeTab";

	/* Triggers */
	actions.map.lb = "historyBack";
	actions.map.rb = "historyForward";
	actions.map.lt = "tabLeft";
	actions.map.rt = "tabRight";

	/* Keyboard */
	actions.map.kb_a = "none";
	actions.map.kb_b = "close";
	actions.map.kb_x = "backspace";
	actions.map.kb_y = "space";
	actions.map.kb_view = "clear";
	actions.map.kb_menu = "enter";
	actions.map.kb_lb = "none";
	actions.map.kb_rb = "none";
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
				"hud-position",
				
				// Mapping
				/* Axis */
				"rightstick",
				"leftstick",

				/* Buttons */
				"dpad",
				"a",
				"b",
				"x",
				"y",
				"menu",
				"view",

				/* Triggers */
				"lb",
				"rb",
				"lt",
				"rt",

				/* Keyboard */
				"kb_a",
				"kb_b",
				"kb_x",
				"kb_y",
				"kb_view",
				"kb_menu",
				"kb_lb",
				"kb_rb"
			], 

			function( results ) {
				// Scroll
				ccSettings.scroll.multiplier = results["scroll-sensitivity"] !== undefined ? Number( results["scroll-sensitivity"] ) : ccSettings.scroll.multiplier;
				ccSettings.scroll.sprintMultiplier = results["scroll-sprint"] !== undefined ? Number( results["scroll-sprint"] ) : ccSettings.scroll.sprintMultiplier;

				// Cursor
				ccSettings.cursor.radius = results["cursor-radius"] !== undefined ? Number( results["cursor-radius"] ) :  ccSettings.cursor.radius;
				ccSettings.cursor.horizontalSpeed = results["horizontal-cursor-sensitivity"] !== undefined ? Number( results["horizontal-cursor-sensitivity"] ) / 3 : ccSettings.cursor.horizontalSpeed;
				ccSettings.cursor.verticalSpeed = results["vertical-cursor-sensitivity"] !== undefined ? Number( results["vertical-cursor-sensitivity"] ) / 3 : ccSettings.cursor.verticalSpeed;
				ccSettings.cursor.idleHideMiliseconds = results["idle-cursor-timer"] !== undefined ? Number( results["idle-cursor-timer"] ) : ccSettings.cursor.idleHideMiliseconds;
				ccSettings.cursor.color = results["cursor-color"] !== undefined ? convertHex( results["cursor-color"] ) : ccSettings.cursor.color;
            
                // Hud
                ccSettings.hud.hidden = results["hud-hidden"] !== undefined ? Boolean( results["hud-hidden"] ) : ccSettings.hud.hidden;
                ccSettings.hud.size = results["hud-size"] !== undefined ? Number( results["hud-size"] ) : ccSettings.hud.size;
                ccSettings.hud.position = results["hud-position"] !== undefined ? results["hud-position"] : ccSettings.hud.position;
			
				// Mapping
				/* Axis */
				actions.map.rightstick = results["rightstick"] !== undefined ? results["rightstick"] : actions.map.rightstick;
				actions.map.leftstick = results["leftstick"] !== undefined ? results["leftstick"] : actions.map.leftstick;

				/* Buttons */
				actions.map.dpad = results["dpad"] !== undefined ? results["dpad"] : actions.map.dpad;
				actions.map.a = results["a"] !== undefined ? results["a"] : actions.map.a;
				actions.map.b = results["b"] !== undefined ? results["b"] : actions.map.b;
				actions.map.x = results["x"] !== undefined ? results["x"] : actions.map.x;
				actions.map.y = results["y"] !== undefined ? results["y"] : actions.map.y;
				actions.map.menu = results["menu"] !== undefined ? results["menu"] : actions.map.menu;
				actions.map.view = results["view"] !== undefined ? results["view"] : actions.map.view;

				/* Triggers */
				actions.map.lb = results["lb"] !== undefined ? results["lb"] : actions.map.lb;
				actions.map.rb = results["rb"] !== undefined ? results["rb"] : actions.map.rb;
				actions.map.lt = results["lt"] !== undefined ? results["lt"] : actions.map.lt;
				actions.map.rt = results["rt"] !== undefined ? results["rt"] : actions.map.rt;

				/* Keyboard */
				actions.map.kb_a = results["kb_a"] !== undefined ? results["kb_a"] : actions.map.kb_a;
				actions.map.kb_b = results["kb_b"] !== undefined ? results["kb_b"] : actions.map.kb_b;
				actions.map.kb_x = results["kb_x"] !== undefined ? results["kb_x"] : actions.map.kb_x;
				actions.map.kb_y = results["kb_y"] !== undefined ? results["kb_y"] : actions.map.kb_y;
				actions.map.kb_view = results["kb_view"] !== undefined ? results["kb_view"] : actions.map.kb_view;
				actions.map.kb_menu = results["kb_menu"] !== undefined ? results["kb_menu"] : actions.map.kb_menu;
				actions.map.kb_lb = results["kb_lb"] !== undefined ? results["kb_lb"] : actions.map.kb_lb;
				actions.map.kb_rb = results["kb_rb"] !== undefined ? results["kb_rb"] : actions.map.kb_rb;
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