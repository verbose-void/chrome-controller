$( ".controller" ).click( function() {
    let $this = $( this );
    let altData = $this.attr( "data-controller-alt" );

    $( ".controller" ).removeClass( "active" );
    $this.addClass( "active" );

    if ( $this.is( ".not-listed" ) ) {
        $( "#not-listed-disclaimer" ).removeClass( "hide" );
    } else {
        $( "#not-listed-disclaimer" ).addClass( "hide" );
    }

    $( "td.label" ).each( function() {
        let $this = $( this );
        $this.text( $this.attr( altData ) );
    } );
} );

$( "#gamepad-api-button" ).click( () => window.open( "http://html5gamepad.com/" ) );