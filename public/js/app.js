
	$( window ).on( 'load', () => {

		var instSkrollr = skrollr.init();

		if( $( window ).width() < 940 || instSkrollr.isMobile() ) {

			instSkrollr.destroy();

		}

		$( window ).resize( function() {

			if( $( window ).width() < 940 || instSkrollr.isMobile() ) {

				instSkrollr.destroy();

			} else {

				instSkrollr = skrollr.init();

			}

		} );

		$( '#modal-member' )
			.on( 'show.bs.modal', function( event ) {

				var modal = $( this ),
						button = $( event.relatedTarget );

			  var name = button.data( 'name' ),
			  		id = button.data( 'id' ),
			  		master = button.data( 'master' ),
						title = button.data( 'title' ) || modal.find( '.modal-title' ).data( 'default' );


				modal.find( '.modal-title' ).text( title );
			  modal.find( 'form input[name=id]' ).val( id );
			  modal.find( 'form input[name=name]' ).val( name );
			  modal.find( 'form input[name=master]' ).prop("checked", Boolean( master ) );

				console.log( $( 'form ') );
			} );

		$( '#modal-confirm-cancel-master, #modal-accept-member, #modal-refuse-member' )
			.on( 'show.bs.modal', function( event ) {

				var modal = $( this ),
						button = $( event.relatedTarget );

			  var name = button.data( 'name' ),
			  		id = button.data( 'id' ),
						title = button.data( 'title' ) || modal.find( '.modal-title' ).data( 'default' );


				modal.find( '.modal-title' ).text( title );
			  modal.find( 'form input[name=id]' ).val( id );
			  modal.find( 'form input[name=name]' ).val( name );

				console.log( $( 'form ') );
			} );

	} );
