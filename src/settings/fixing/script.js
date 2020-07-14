const defaultAction = {
    "run": function() {},
    "map": ""
};
var cursorMoveDelta = performance.now();
var prevFrame = performance.now();

function press( sel ) {
    let $s = $( sel );
    if ( $s[ 0 ] ) {
        $s.click();
    }
}

// Define Action Handlers
const actions = {
    "scroll": {
        ...defaultAction,

        "run": function( e ) {
            if ( ( e.detail.axis !== 1 && e.detail.axis !== 3 && e.detail.axis ) || $( "#ccosk-container" )[ 0 ] ) {
                return;
            }

            const am = e.detail.current < 0.1 && e.detail.current > -0.1 ? 0 : e.detail.current * ccSettings.scroll.multiplier;
            if ( am !== 0 ) {
                let pressed = e.detail.axis <= 1 ? e.detail.controller.buttons[ 10 ].pressed : e.detail.controller.buttons[ 11 ].pressed;
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
            if ( actions.eventToControlMap[ e.type ] === "dpad" ) {
                cursorMoveDelta = prevFrame - performance.now();
                prevFrame = performance.now();

                cursor.updatePos(
                    e.detail.controller.buttons[ 14 ].value <= 0 ? e.detail.controller.buttons[ 15 ].value : -e.detail.controller.buttons[ 14 ].value,
                    e.detail.controller.buttons[ 12 ].value <= 0 ? e.detail.controller.buttons[ 13 ].value : -e.detail.controller.buttons[ 12 ].value,
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
            chrome.runtime.sendMessage( {
                eventType: "opennewtab"
            } );
        }
    },

    "closeTab": {
        ...defaultAction,

        "run": function() {
            chrome.runtime.sendMessage( {
                eventType: "closecurrenttab"
            } );
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
            chrome.runtime.sendMessage( {
                eventType: "movetableft"
            } );
        }
    },

    "tabRight": {
        ...defaultAction,

        "run": function() {
            chrome.runtime.sendMessage( {
                eventType: "movetabright"
            } );
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
            $( "#ccosk-text" )[ 0 ].value = "";
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
