/* 
 *************************************
 * <!-- Full Page Transition -->
 *************************************
 */
App = ( function ( App, $, window, document ) {
    'use strict';
    
    var documentReady = function( $ ) {

		//Prevent this module from loading in other pages
		if ( !$( 'body' ).hasClass( 'page-mousewheel-eff' ) ) return false;
		
		
	    //Determine the direction of a jQuery scroll event
		//Fix an issue for mousewheel event is too fast.
		var lastAnimation     = 0,
			quietPeriod       = 500, //Do not change it
			animationTime     = 1000,//According to page transition animation changes
			updateURL         = true,
			$el               = $( '.custom-fullpage-container' ),
			$sections         = $el.find( '> section' ),
			sectionTotal      = $sections.length,
			topSectionSpacing = $( '.header-area' ).outerHeight( true );
		
		if ( $el.length == 0 ) return false;
		
		
		$( document ).on( 'wheel', function( e ) { 

			var dir;
			//Gets a value that indicates the amount that the mouse wheel has changed.
			var delta = e.originalEvent.deltaY;
			
			if( delta > 0 ) { 
				//scroll down
				dir = 'down';
				
			} else {
				//scroll up
				dir = 'up';
			}
			
			scrollMoveInit( e, dir );
			
			//prevent page fom scrolling
			return false;

		});
		

		// Prepare everything before binding wheel scroll
		$.each( $sections, function( i ) {
			$( this ).attr( 'data-index', i );
			if ( i == 0 ) {
				$( this ).addClass( 'active' );

			}
			
		});
		

		
		//Add hashchange event
		setTimeout( function() {
			var hash = window.location.hash,
				locArr,
				loc, 
				curTab;
			
			if ( hash ) {
				locArr = hash.split( '-' );
				loc    = locArr[1];
				moveTo( $el, 'down', loc );
			}

		}, quietPeriod );
		
		
		
		
		/*
		 * Scroll initialize
		 *
		 * @param  {object} event        - The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated. 
		 * @param  {string} dir          - Gets a value that indicates the amount that the mouse wheel has changed.
		 * @return {void}                - The constructor.
		 */
		function scrollMoveInit( event, dir ) {
	
			var timeNow = new Date().getTime();
			// Cancel scroll if currently animating or within quiet period
			if( timeNow - lastAnimation < quietPeriod + animationTime) {
				event.preventDefault();
				return;
			}

			if ( dir == 'down' ) {
				//scroll down
				moveTo( $el, 'down', false );
				
			} else {
				//scroll up
				moveTo( $el, 'up', false );
				
			  
			}
			lastAnimation = timeNow;
		}
		
      
		
		/*
		 * Move Animation
		 *
		 * @param  {object} el           - The container of each sections.
		 * @param  {string} dir          - Rolling direction indicator.
		 * @param  {number} hashID       - ID of custom hashchange event.
		 * @return {void}                - The constructor.
		 */
		function moveTo( el, dir, hashID ) {
			var index     = parseFloat( $sections.filter( '.active' ).attr( 'data-index' ) ),
				nextIndex = null,
				$next     = null,
				isNumeric = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;
			
			
			 
			if ( dir == 'down' ) {
				nextIndex = index + 1;
			} else {
				nextIndex = index - 1;
			}
			
			if ( nextIndex > sectionTotal-1 ) nextIndex = sectionTotal-1;
			if ( nextIndex < 0 ) nextIndex = 0;
			

			
			//ID of custom hashchange event
			if ( hashID && isNumeric.test( hashID ) ) nextIndex = parseFloat( hashID - 1 );
			
			//Returns the target section
			$next = $sections.eq( nextIndex );
			
			//Smooth scroll to content
			TweenMax.to( window, animationTime/1000, {
				scrollTo: {
					y: $next.offset().top - topSectionSpacing
				},
				ease: Power2.easeOut,
				onComplete: function() {
					$sections.removeClass( 'active' );
					$next.addClass( 'active' );
				}
			});		


			//Changing The Site URL
			if ( history.replaceState && updateURL == true ) {
				
				var href = window.location.href.substr( 0, window.location.href.indexOf('#')) + "#section-" + (nextIndex+1);
				
				history.pushState( {}, document.title, href );
			}
			
		}
		
    };

    App.fullPage = {
        documentReady : documentReady        
    };

    App.components.documentReady.push( documentReady );
    return App;

}( App, jQuery, window, document ) );







