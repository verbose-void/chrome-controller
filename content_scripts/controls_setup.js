$( () => {
	for ( let event in actions.eventToControlMap ) {
		window.addEventListener( event, e => {
			let action = actions[actions.map[actions.eventToControlMap[event]]];
			if ( action ) {
				action.run( e );
			}
		} );
	}
} );
