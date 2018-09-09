var selected;

$( ".key" ).click( function( e ) {
    if ( selected ) {
        selected.removeClass( "selected" );
    }
    
    selected = $( this );
    selected.addClass( "selected" );
} );