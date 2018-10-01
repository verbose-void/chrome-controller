$( () => {
	for ( let event in actions.eventToControlMap ) {
		window.addEventListener( event, e => {
			let control = actions.eventToControlMap[event];
			let action = actions[actions.map[control]];
			let kb_action = actions[actions.map["kb_" + control]];

			// If is a keyboard supported event
			if ( kb_action ) {
				// And if keyboard is open
				if ( cursor && cursor.keyboard ) {
					// Change the action to the keyboard's.
					action = kb_action === "none" ? null : kb_action;
				}
			}

			if ( action ) {
				action.run( e );
			}
		} );
	}
} );
