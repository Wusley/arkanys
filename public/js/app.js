
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

		$('[data-tooltip="true"]').tooltip()

		$( '#modal-master, #modal-member' )
			.on( 'show.bs.modal', function( event ) {
				var modal = $( this ),
						button = $( event.relatedTarget );

			  var name = button.data( 'name' ),
			  		id = button.data( 'id' ),
			  		whatsapp = button.data( 'whatsapp' ),
			  		master = button.data( 'master' ),
			  		masterId = button.data( 'master-id' ),
			  		memberId = button.data( 'member-id' ),
						title = button.data( 'title' ) || modal.find( '.modal-title' ).data( 'default' );

				modal.find( '.modal-title' ).text( title );
			  modal.find( 'form input[name=id]' ).val( id );
			  modal.find( 'form input[name=whatsapp]' ).val( whatsapp );
			  modal.find( 'form input[name=name]' ).val( name );
			  modal.find( 'form input[name=master-id]' ).val( masterId );
			  modal.find( 'form input[name=member-id]' ).val( memberId );
			  modal.find( 'form input[name=master]' ).prop("checked", Boolean( master ) );

				console.log( $( 'form ') );
			} );

		$( '#modal-confirm-cancel-master, #modal-confirm-cancel-disciple, #modal-accept-member, #modal-accept-master, #modal-refuse-member, #modal-refuse-master, #modal-unlink-member, #modal-unlink-master' )
			.on( 'show.bs.modal', function( event ) {

				var modal = $( this ),
						button = $( event.relatedTarget );

			  var name = button.data( 'name' ),
			  		id = button.data( 'id' ),
			  		memberId = button.data( 'member-id' ),
			  		masterId = button.data( 'master-id' ),
						title = button.data( 'title' ) || modal.find( '.modal-title' ).data( 'default' );

				modal.find( '.modal-title' ).text( title );
			  modal.find( 'form input[name=id]' ).val( id );
			  modal.find( 'form input[name=member-id]' ).val( memberId );
			  modal.find( 'form input[name=master-id]' ).val( masterId );
			  modal.find( 'form input[name=name]' ).val( name );

				console.log( $( 'form ') );
			} );

	} );
