/* 
 *************************************
 * <!-- 3D Explosive Particle Slider -->
 *************************************
 */

/**
 * APP._3D_EXP_PARTICLE_SLIDER
 * @global
 * @requires ./examples/assets/js/min/three.min.js
 * @requires ./src/components/ES5/_plugins-THREE
 */

APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP._3D_EXP_PARTICLE_SLIDER               = APP._3D_EXP_PARTICLE_SLIDER || {};
	APP._3D_EXP_PARTICLE_SLIDER.version       = '0.0.2';
    APP._3D_EXP_PARTICLE_SLIDER.documentReady = function( $ ) {

		
		//Prevent this module from loading in other pages
		if ( $( '.uix-3d-slider--expParticle' ).length == 0 || ! Modernizr.webgl ) return false;
		
		
		var MainStage = function() {

			var $window                   = $( window ),
				windowWidth               = window.innerWidth,
				windowHeight              = window.innerHeight;


			var animSpeed                 = 1000,
				$sliderWrapper            = $( '.uix-3d-slider--expParticle' ),



				//Basic webGL renderers 
				renderLoaderID            = 'uix-3d-slider--expParticle__loader',
				rendererOuterID           = 'uix-3d-slider--expParticle__canvas-container',
				rendererCanvasID          = 'uix-3d-slider--expParticle__canvas',
				renderer;



			// Generate one plane geometries mesh to scene
			//-------------------------------------	
			var camera,
				controls,
				scene,
				light,
				renderer,
				material,
				displacementSprite,
				clock = new THREE.Clock();


			var offsetWidth   = 475, //Set the display width of the objects in the Stage
				offsetHeight  = 375, //Set the display height of the objects in the Stage
				allSources    = [],
				objTotal,
				objLoaded = false;

		
			
			var sources = [];
			var isAnimating = false;
			
			
			// constants
			var activeSlider = 0;
			
			var cube_count,
				meshes = [],
				materials = [],
				xgrid = 25,
				ygrid = 15;
			
			
			function wrapperInit() {
				
				$sliderWrapper.each( function()  {

					var $this                    = $( this ),
						$items                   = $this.find( '.uix-3d-slider--expParticle__item' ),
						$first                   = $items.first(),
						itemsTotal               = $items.length,
						dataControlsPagination   = $this.data( 'controls-pagination' ),
						dataControlsArrows       = $this.data( 'controls-arrows' ),
						dataLoop                 = $this.data( 'loop' ),
						dataFilterTexture        = $this.data( 'filter-texture' ),
						dataDraggable            = $this.data( 'draggable' ),
						dataDraggableCursor      = $this.data( 'draggable-cursor' );


					if ( typeof dataControlsPagination === typeof undefined ) dataControlsPagination = '.uix-3d-slider--expParticle__pagination';
					if ( typeof dataControlsArrows === typeof undefined || dataControlsArrows == false ) dataControlsArrows = '.uix-3d-slider--expParticle__arrows';
					if ( typeof dataLoop === typeof undefined ) dataLoop = false;
					if ( typeof dataFilterTexture === typeof undefined || !dataFilterTexture || dataFilterTexture == '' ) dataFilterTexture = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
					if ( typeof dataDraggable === typeof undefined ) dataDraggable = false;
					if ( typeof dataDraggableCursor === typeof undefined ) dataDraggableCursor = 'move';
					
					

					//Autoplay times
					var playTimes;
					//A function called "timer" once every second (like a digital watch).
					$this[0].animatedSlides;

					

					//If arrows does not exist on the page, it will be added by default, 
					//and the drag and drop function will be activated.
					if ( $( dataControlsArrows ).length == 0 ) {
						$( 'body' ).prepend( '<div style="display:none;" class="uix-3d-slider--expParticle__arrows '+dataControlsArrows.replace('#','').replace('.','')+'"><a href="#" class="uix-3d-slider--expParticle__arrows--prev"></a><a href="#" class="uix-3d-slider--expParticle__arrows--next"></a></div>' );
					}



					//Prevent bubbling
					if ( itemsTotal == 1 ) {
						$( dataControlsPagination ).hide();
						$( dataControlsArrows ).hide();
					}

					
					//Initialize the controlers classes
					//-------------------------------------	
					$( dataControlsPagination ).find( 'ul > li' ).first().addClass( 'active' );


					
					
					//Initialize the wrapper width and height
					//-------------------------------------	
					$this.css( 'height', windowHeight + 'px' );
					

					//Load slides to canvas
					//-------------------------------------	
					if ( $( '#' + rendererCanvasID ).length == 0 ) {
						$this.prepend( '<div id="'+rendererOuterID+'" class="uix-advanced-slider-sp__canvas-container"><canvas id="'+rendererCanvasID+'"></canvas></div>' );

					}

					
					//Get the animation speed
					//-------------------------------------	
					if ( typeof $this.data( 'speed' ) != typeof undefined && $this.data( 'speed' ) != false ) {
						animSpeed = $this.data( 'speed' );
					}


					//Initialize the first item container
					//-------------------------------------		
					$items.addClass( 'next' );
					$first.addClass( 'active' );



					//Get all images and videos
					//-------------------------------------		
					$items.each( function()  {
						var _item = $( this );
						
						if ( _item.find( 'video' ).length > 0 ) {

							//Returns the dimensions (intrinsic height and width ) of the video
							var video    = document.getElementById( _item.find( 'video' ).attr( 'id' ) ),
								videoURL = _item.find( 'source:first' ).attr( 'src' );

							if ( typeof videoURL != typeof undefined ) {
								sources.push(
									{
										"url": videoURL,
										"id": _item.find( 'video' ).attr( 'id' ),
										"type": 'video'
									}
								);
							}




						} else {

							var imgURL   = _item.find( 'img' ).attr( 'src' );

							if ( typeof imgURL != typeof undefined ) {

								sources.push(
									{
										"url": imgURL,
										"id": 'img-' + UixGUID.create(),
										"type": 'img'
									}
								);
							}


						}	

					});
					
					

					//Pagination dots 
					//-------------------------------------	
					var _dot       = '',
						_dotActive = '';
					_dot += '<ul>';
					for ( var i = 0; i < itemsTotal; i++ ) {

						_dotActive = ( i == 0 ) ? 'class="active"' : '';

						_dot += '<li '+_dotActive+' data-index="'+i+'"><a href="javascript:"></a></li>';
					}
					_dot += '</ul>';

					if ( $( dataControlsPagination ).html() == '' ) $( dataControlsPagination ).html( _dot );

					
					//Fire the slider transtion with buttons
					$( dataControlsPagination ).find( 'ul > li' ).on( 'click', function( e ) {
						e.preventDefault();

						var slideCurId  = $( dataControlsPagination ).find( 'ul > li.active' ).index(),
							slideNextId = $( this ).index();


						//Determine the direction
						var curDir = 'prev';
						if ( $( this ).attr( 'data-index' ) > slideCurId ) {
							curDir = 'next';
						}


						//Transition Between Slides
						sliderUpdates( slideCurId, slideNextId, curDir );


						//Pause the auto play event
						clearInterval( $this[0].animatedSlides );	


					});

					//Next/Prev buttons
					//-------------------------------------		
					var _prev = $( dataControlsArrows ).find( '.uix-3d-slider--expParticle__arrows--prev' ),
						_next = $( dataControlsArrows ).find( '.uix-3d-slider--expParticle__arrows--next' );

					$( dataControlsArrows ).find( 'a' ).attr( 'href', 'javascript:' );

					$( dataControlsArrows ).find( 'a' ).removeClass( 'disabled' );
					if ( !dataLoop ) {
						_prev.addClass( 'disabled' );
					}


					_prev.on( 'click', function( e ) {
						e.preventDefault();

						var slideCurId  = $items.filter( '.active' ).index(),
							slideNextId = parseFloat( $items.filter( '.active' ).index() ) - 1;
	
						//Transition Between Slides
						sliderUpdates( slideCurId, slideNextId, 'prev' );	
						
						


						//Pause the auto play event
						clearInterval( $this[0].animatedSlides );

					});

					_next.on( 'click', function( e ) {
						e.preventDefault();

						var slideCurId  = $items.filter( '.active' ).index(),
							slideNextId = parseFloat( $items.filter( '.active' ).index() ) + 1;
	
						//Transition Between Slides
						sliderUpdates( slideCurId, slideNextId, 'next' );	


						//Pause the auto play event
						clearInterval( $this[0].animatedSlides );


					});
					

					
					//Autoplay Slider
					//-------------------------------------		
					var dataAuto                 = $this.data( 'auto' ),
						dataTiming               = $this.data( 'timing' ),
						dataLoop                 = $this.data( 'loop' );

					if ( typeof dataAuto === typeof undefined ) dataAuto = false;	
					if ( typeof dataTiming === typeof undefined ) dataTiming = 10000;
					if ( typeof dataLoop === typeof undefined ) dataLoop = false;


					if ( dataAuto && !isNaN( parseFloat( dataTiming ) ) && isFinite( dataTiming ) ) {

						sliderAutoPlay( playTimes, dataTiming, dataLoop, $this );

						$this.on({
							mouseenter: function() {
								clearInterval( $this[0].animatedSlides );
							},
							mouseleave: function() {
								sliderAutoPlay( playTimes, dataTiming, dataLoop, $this );
							}
						});	

					}


				});// end each				
			}


			
			function init() {

				

				//Core 3D stage begin
				//-------------------------------------		
				//camera
				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 10,  2500 ); // FlyCamera // FlyControls
				camera.movementSpeed = 100.0;
				camera.rollSpeed = 0.5;
				camera.position.y = 60;
				camera.position.z = 500;



				//Scene
				scene = new THREE.Scene();


				//HemisphereLight
				scene.add( new THREE.AmbientLight( 0x555555 ) );

				light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 0, 2000 );
				scene.add( light );



				//WebGL Renderer	
				 // create a render and set the size
				renderer = new THREE.WebGLRenderer( { 
										canvas   : document.getElementById( rendererCanvasID ), //canvas
										alpha    : true, 
										antialias: true 
									} );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				//controls
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.autoRotate = false;
				controls.autoRotateSpeed = 0.5;
				controls.rotateSpeed = 0.5;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.enableZoom = false;
				controls.target.set(0, 0, 0 );
				controls.update();			



				//A loader for loading all images from array.
				var loader = new THREE.TextureLoader();
				loader.crossOrigin = 'anonymous';


				//Preload
				objTotal = sources.length;
			
				sources.forEach( function( element, index ) {
					
				
					if ( element.type == 'img' ) {
						
						
						loader.load(
							// resource URL
							element.url,

							// onLoad callback
							function ( texture ) {
								
								loadSource( texture, index, offsetWidth, offsetHeight, objTotal, $( '#' + renderLoaderID ) );

							},

							// onProgress callback currently not supported
							undefined,

							// onError callback
							function ( err ) {
								console.error( 'An error happened.' );
							}
						);	
						
						
						
					} else {
						
					
						var texture = new THREE.VideoTexture( document.getElementById( element.id ) );
						texture.minFilter = THREE.LinearFilter;
						texture.magFilter = THREE.LinearFilter;
						texture.format = THREE.RGBFormat;

						// pause the video
						texture.image.autoplay = true;
						texture.image.loop = true;
						texture.image.currentTime = 0;
						texture.image.muted = true;
						texture.image.play();	

						
						
						loadSource( texture, index, offsetWidth, offsetHeight, objTotal, $( '#' + renderLoaderID ) );
					}
					
				});
		

				// Fires when the window changes
				window.addEventListener( 'resize', onWindowResize, false );


			}





			function render() {
				requestAnimationFrame( render );

				var t = clock.getElapsedTime();


				//To set a background color.
				//renderer.setClearColor( 0x000000 );	



				//Display the destination object
				if ( typeof allSources[activeSlider] != typeof undefined ) {

					var objects = allSources[activeSlider].children;
					var speed =  Math.random() * .0002;

					for ( var i = 0; i < objects.length; i++ ) {


						for ( var j = 0; j < objects[i].parent.children.length; j++ ) {
							var obj = objects[i].parent.children[j];

							obj.position.x += (obj.origPos.x - obj.position.x) * speed;
							obj.position.y += (obj.origPos.y - obj.position.y) * speed;
							obj.position.z += (obj.origPos.z - obj.position.z) * speed;

							
						}	

					}	
					

				}	
				
				
				//Hide inactive objects
				allSources.forEach( function ( element, index ) {
					if ( index != activeSlider ) {

						var objects = element.children;
						var speed =  Math.random() * .00005;

						for ( var i = 0; i < objects.length; i++ ) {


							for ( var j = 0; j < objects[i].parent.children.length; j++ ) {
								var obj = objects[i].parent.children[j];
								
								obj.position.x += (obj.targetPos.x - obj.position.x) * speed;
								obj.position.y += (obj.targetPos.y - obj.position.y) * speed;
								obj.position.z += (obj.targetPos.z - obj.position.z) * speed;

							}	

						}		
					}

				});
	

			
				//check all images loaded
				if ( typeof allSources != typeof undefined ) {
					if ( !objLoaded && allSources.length === objTotal ) {
						
						allSources.forEach( function ( element, index ) {
							scene.add( element );
							console.log( element );
						});
						objLoaded = true;


					}	

				}


				//update camera and controls
				controls.update();

				renderer.render( scene, camera );


			}


			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			

			/*
			 * Load Source
			 *
			 * @param  {Object} texture         - Returns a new texture object which can directly be used for material creation.
			 * @param  {Number} index           - Index of image or video.
			 * @param  {Number} w               - The width of an image or video, in pixels. 
			 * @param  {Number} h               - The height of an image or video, in pixels. 
			 * @param  {Number} total           - Total number of preload images or video.
			 * @param  {Object} loading         - Progress bar display control.
			 * @return {Void}
			 */
			function loadSource( texture, index, w, h, total, loading ) {

				var imgW = w,
					imgH = h;
				
				
				//
				var group = new THREE.Object3D();
				var i, j, ux, uy, ox, oy,
					geometry,
					xsize, ysize;
				ux = 1 / xgrid;
				uy = 1 / ygrid;
				xsize = imgW / xgrid;
				ysize = imgH / ygrid;
				cube_count = 0;
				for ( i = 0; i < xgrid; i ++ ) {
					for ( j = 0; j < ygrid; j ++ ) {
						ox = i;
						oy = j;
						geometry = new THREE.BoxBufferGeometry( xsize, ysize, xsize );
						changeUVS( geometry, ux, uy, ox, oy );
						materials[ cube_count ] = new THREE.MeshBasicMaterial( {
							map: texture
						 } );
						material = materials[ cube_count ];
						displacementSprite = new THREE.Mesh( geometry, material );
						displacementSprite.position.x = ( i - xgrid / 2 ) * xsize;
						displacementSprite.position.y = ( j - ygrid / 2 ) * ysize;
						displacementSprite.position.z = 0;
						displacementSprite.scale.x = displacementSprite.scale.y = displacementSprite.scale.z = 1;
						displacementSprite.origPos	= {
							x: displacementSprite.position.x,
							y: displacementSprite.position.y,
							z: displacementSprite.position.z
						};

						
						//hide all
						var newPosX = 4000 * Math.random() * ( Math.random() > 0.5 ? 1 : -1 );
						var newPosY = 2000 * Math.random();
						var newPosZ = 3000 * Math.random();
						displacementSprite.position.x = newPosX;
						displacementSprite.position.y = newPosY;
						displacementSprite.position.z = newPosZ;
						
						displacementSprite.targetPos	= {
							x: newPosX,
							y: newPosY,
							z: newPosZ
						};	
						
						//
						group.add( displacementSprite );
						
					
						
						//
						meshes[ cube_count ] = displacementSprite;
						cube_count += 1;
					}			
				}
				

				allSources.push( group );


				//loading
				TweenMax.to( loading, 0.5, {
					width    : Math.round(100 * allSources.length / total ) + '%',
					onComplete : function() {

						if ( $( this.target ).width() >= windowWidth - 50 ) {

							TweenMax.to( this.target, 0.5, {
								alpha: 0
							});	
						}

					}
				});
					

			}


			function changeUVS( geometry, unitx, unity, offsetx, offsety ) {
				var uvs = geometry.attributes.uv.array;
				for ( var i = 0; i < uvs.length; i += 2 ) {
					uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
					uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;
				}
			}	
			
			
			
	

			
		 /*
		 * Trigger slider autoplay
		 *
		 * @param  {Function} playTimes      - Number of times.
		 * @param  {Number} timing           - Autoplay interval.
		 * @param  {Boolean} loop            - Determine whether to loop through each item.
		 * @param  {Object} slider           - Selector of the slider .
		 * @return {Void}                    - The constructor.
		 */
		function sliderAutoPlay( playTimes, timing, loop, slider ) {	

			var items = slider.find( '.uix-3d-slider--expParticle__item' ),
				total = items.length;
			
			slider[0].animatedSlides = setInterval( function() {

					playTimes = parseFloat( items.filter( '.active' ).index() );
					playTimes++;

					
					if ( !loop ) {
						if ( playTimes < total && playTimes >= 0 ) {
							
							var slideCurId  = items.filter( '.active' ).index(),
								slideNextId = playTimes;	

							sliderUpdates( slideCurId, slideNextId, 'next' );
						}
					} else {
						if ( playTimes == total ) playTimes = 0;
						if ( playTimes < 0 ) playTimes = total-1;		

						var slideCurId  = items.filter( '.active' ).index(),
							slideNextId = playTimes;	

						
						//Prevent problems with styles when switching in positive order
						if ( playTimes == 0 ) {
							sliderUpdates( slideCurId, slideNextId, 'prev' );	
						} else {
							sliderUpdates( slideCurId, slideNextId, 'next' );
						}

					}



				}, timing );	
			}

			
			
			/*
			 *  Transition Between Slides
			 *
			 * @param  {Number} slideCurId             - Index of current slider.
			 * @param  {Number} slideNextId            - Index of next slider.
			 * @param  {String} dir                    - Switching direction indicator.	 
			 * @return {Void}
			 */
			function sliderUpdates( slideCurId, slideNextId, dir ) {


				var $items                   = $sliderWrapper.find( '.uix-3d-slider--expParticle__item' ),
					total                    = $items.length,
					dataCountTotal           = $sliderWrapper.data( 'count-total' ),
					dataCountCur             = $sliderWrapper.data( 'count-now' ),
					dataControlsPagination   = $sliderWrapper.data( 'controls-pagination' ),
					dataControlsArrows       = $sliderWrapper.data( 'controls-arrows' ),	
					dataLoop                 = $sliderWrapper.data( 'loop' );
	
			
				
				if ( typeof dataCountTotal === typeof undefined ) dataCountTotal = 'p.count em.count';
				if ( typeof dataCountCur === typeof undefined ) dataCountCur = 'p.count em.current';
				if ( typeof dataControlsPagination === typeof undefined ) dataControlsPagination = '.uix-3d-slider--expParticle__pagination';
				if ( typeof dataControlsArrows === typeof undefined ) dataControlsArrows = '.uix-3d-slider--expParticle__arrows';
				if ( typeof dataLoop === typeof undefined ) dataLoop = false;			

				//Prevent bubbling
				if ( total == 1 ) {
					$( dataControlsPagination ).hide();
					$( dataControlsArrows ).hide();
					return false;
				}

				if ( ! isAnimating ) {
					isAnimating = true;
					
					
					//Transition Interception
					//-------------------------------------
					if ( dataLoop ) {
						if ( slideCurId > total - 1 ) slideCurId = 0;
						if ( slideCurId < 0 ) slideCurId = total-1;	

						//--
						if ( slideNextId < 0 ) slideNextId = total-1;
						if ( slideNextId > total - 1 ) slideNextId = 0;
					} else {

						if ( slideCurId > total - 1 ) slideCurId = total-1;
						if ( slideCurId < 0 ) slideCurId = 0;	

						//--
						if ( slideNextId < 0 ) slideNextId = 0;
						if ( slideNextId > total - 1 ) slideNextId = total-1;

					}



					//Get previous and next index of item
					//-------------------------------------
					var $current = $sliderWrapper.find( '.uix-3d-slider--expParticle__item' ).eq( slideCurId );
					var	$next    = $sliderWrapper.find( '.uix-3d-slider--expParticle__item' ).eq( slideNextId );



					console.log( 'Current: ' + slideCurId + ' | Next: ' + slideNextId );


					//Determine the direction and add class to switching direction indicator.
					//-------------------------------------
					var dirIndicatorClass = '';
					if ( dir == 'prev' ) dirIndicatorClass = 'prev';
					if ( dir == 'next' ) dirIndicatorClass = 'next';


					//Add transition class to each item
					//-------------------------------------	
					$items.removeClass( 'active leave prev next' )
						  .addClass( dirIndicatorClass );

					$current.addClass( 'leave' );
					$next.addClass( 'active' );



					//Add transition class to Controls Pagination
					//-------------------------------------
					$( dataControlsPagination ).find( 'ul > li' ).removeClass( 'active leave prev next' )
											   .addClass( dirIndicatorClass );

					$( dataControlsPagination ).find( 'ul > li' ).eq( slideCurId ).addClass( 'leave' );
					$( dataControlsPagination ).find( 'ul > li' ).eq( slideNextId ).addClass( 'active' );



					//Add transition class to Arrows
					//-------------------------------------		
					if ( ! dataLoop ) {
						$( dataControlsArrows ).find( 'a' ).removeClass( 'disabled' );
						if ( slideNextId == total - 1 ) $( dataControlsArrows ).find( '.uix-3d-slider--expParticle__arrows--next' ).addClass( 'disabled' );
						if ( slideNextId == 0 ) $( dataControlsArrows ).find( '.uix-3d-slider--expParticle__arrows--prev' ).addClass( 'disabled' );
					}




					//Display counter
					//-------------------------------------
					$( dataCountTotal ).text( total );
					$( dataCountCur ).text( parseFloat( slideCurId ) + 1 );		





					//Fire the next object
					//-------------------------------------
					activeSlider = slideNextId;
				

					//Fire the current object
					//-------------------------------------
				

					//Reset the trigger
					//-------------------------------------
					isAnimating = false;			
					
					
				}// end isAnimating
				
				

			}

			
			


			// 
			//-------------------------------------	
			return {
				init              : init,
				wrapperInit       : wrapperInit,
				render            : render,
				getScene          : function () { return scene; },
				getCamera         : function () { return camera; } 
			};


		}();

		MainStage.wrapperInit();
		MainStage.init();
		MainStage.render();
		

		
    };
	
    APP.components.documentReady.push( APP._3D_EXP_PARTICLE_SLIDER.documentReady );
    return APP;

}( APP, jQuery, window, document ) );







