
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

			} );

			// MENU
			var beginAC = 80,
					endAC = 320,
					beginB = 80,
					endB = 320;
			/* Awesome burger default */

			var pathA = document.getElementById('pathA'),
					pathB = document.getElementById('pathB'),
					pathC = document.getElementById('pathC'),
					segmentA = new Segment(pathA, beginAC, endAC),
					segmentB = new Segment(pathB, beginB, endB),
					segmentC = new Segment(pathC, beginAC, endAC),
					toCloseIcon = true,
					wrapper = document.getElementById('menu-icon-wrapper');

			wrapper.style.visibility = 'visible';

			var handle = {
		    inAC: function(s) {
		      var $this = this;
		  	    s.draw('80% - 240', '80%', 0.3, {
		  	        delay: 0.1,
		  	        callback: function() {
		  	           $this.inAC2(s)
		  	        }
		  	    });
		  	},
		    inAC2: function(s) {
		  	    s.draw('100% - 545', '100% - 305', 0.6, {
		  	        easing: ease.ease('elastic-out', 1, 0.3)
		  	    });
		  	},
		    inB: function(s, beginB, endB) {
		      var $this = this;
		  	    s.draw(beginB - 60, endB + 60, 0.1, {
		  	        callback: function() {
		  	            $this.inB2(s, beginB, endB)
		  	        }
		  	    });
		  	},
		    inB2: function(s, beginB, endB) {
		  	    s.draw(beginB + 120, endB - 120, 0.3, {
		  	        easing: ease.ease('bounce-out', 1, 0.3)
		  	    });
		  	},
		    outAC: function(s, beginAC, endAC) {
		      var $this = this;
		  	    s.draw('90% - 240', '90%', 0.1, {
		  	        easing: ease.ease('elastic-in', 1, 0.3),
		  	        callback: function() {
		  	            $this.outAC2(s, beginAC, endAC)
		  	        }
		  	    });
		  	},
		    outAC2: function(s, beginAC, endAC) {
		        var $this = this;
		  	    s.draw('20% - 240', '20%', 0.3, {
		  	        callback: function() {
		  	            $this.outAC3(s, beginAC, endAC)
		  	        }
		  	    });
		  	},
		  	outAC3: function(s, beginAC, endAC) {
		  	    s.draw(beginAC, endAC, 0.7, {
		  	        easing: ease.ease('elastic-out', 1, 0.3)
		  	    });
		  	},
		    outB: function(s, beginB, endB) {
		  	    s.draw(beginB, endB, 0.7, {
		  	        delay: 0.1,
		  	        easing: ease.ease('elastic-out', 2, 0.4)
		  	    });
		  	},
		    addScale: function(m) {
		  		m.className = 'menu-icon-wrapper scaled';
		  	},
		    removeScale: function(m) {
		  		m.className = 'menu-icon-wrapper';
		  	}
		  };

			$( '#menu-icon-trigger' ).on( 'click', function() {

				var $dummy = $( '#dummy' ),
						$menu = $( '#menu' );

				if (toCloseIcon) {
					handle.inAC(segmentA);
					handle.inB(segmentB, beginB, endB);
					handle.inAC(segmentC);

					 $dummy.addClass( 'dummy--active' );
					 $menu.addClass( 'activated' );
				} else {
					handle.outAC(segmentA, beginAC, endAC);
					handle.outB(segmentB, beginB, endB);
					handle.outAC(segmentC, beginAC, endAC);

					$dummy.removeClass( 'dummy--active' );
					$menu.removeClass( 'activated' );
				}
				toCloseIcon = !toCloseIcon;
			} );
		// END MENU

	} );
