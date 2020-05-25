
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

	} );
