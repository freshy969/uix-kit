
/* 
 *************************************
 * <!-- Dynamic Drop Down List from JSON -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.DYNAMIC_DD_LIST               = APP.DYNAMIC_DD_LIST || {};
	APP.DYNAMIC_DD_LIST.version       = '0.0.5';
    APP.DYNAMIC_DD_LIST.documentReady = function( $ ) {


			
		$( '[data-ajax-dynamic-dd-json]' ).each( function() {
			var $this            = $( this ),
			    jsonFile         = $this.data( 'ajax-dynamic-dd-json' ),
				ranID            = 'dynamic-dd-control-' + UixGUID.create(),
				ID               = $this.attr( 'id' ),
				method           = $this.data( 'ajax-dynamic-dd-method' ),
				autoExpand       = $this.data( 'ajax-dynamic-dd-auto-expand' ),
				associated       = $this.data( 'ajax-dynamic-dd-associated' ),
				associated2      = $this.data( 'ajax-dynamic-dd-associated2' ),
				toData           = $this.data( 'ajax-dynamic-dd-data' ),
				emptyTxt1        = $this.data( 'ajax-dynamic-dd-this-text' ),
				emptyTxt2        = $this.data( 'ajax-dynamic-dd-associated-text' ),
				emptyTxt3        = $this.data( 'ajax-dynamic-dd-associated2-text' ),
				thisChange       = true,
				curID;
	
					
			if ( typeof emptyTxt1 === typeof undefined ) emptyTxt1 = '-';
			if ( typeof emptyTxt2 === typeof undefined ) emptyTxt2 = '-';
			if ( typeof emptyTxt3 === typeof undefined ) emptyTxt3 = '-';
			if ( typeof jsonFile === typeof undefined ) jsonFile = '';
			if ( typeof toData === typeof undefined ) toData = '';
			if ( typeof method === typeof undefined ) method = 'POST';
			if ( typeof autoExpand === typeof undefined ) autoExpand = true;
			if ( typeof associated === typeof undefined ) associated = '#demo';
			if ( typeof associated2 === typeof undefined ) associated2 = '#demo2';
			if ( typeof ID === typeof undefined ) $this.attr( 'id', ranID );
			
			
			

			curID = $this.attr( 'id' );
			
			
			//Parse the JSON data
			if ( jsonFile != '' ) {
			
				//Initialize dependent/chained dropdown list
				var dataExist = $this.data( 'exist' );
				if ( typeof dataExist === typeof undefined && dataExist != 1 ) {

					$.ajax({
						url      : jsonFile,
						method   : method,
						data     : toData,
						dataType : 'json',
						success  : function ( data ) { 

							
								var _level1 = [],
									_level2 = [],
									_level3 = [],
									_level1IDs     = [],
									_level2IDs     = [],
									_level3IDs     = [];


								for ( var m = 0; m < data.length; m++ ) {

									_level1.push( data[m].name );
									_level1IDs.push( data[m].id );

									var level2_List;

									if ( typeof data[0].list === typeof undefined ) {
										//============ China cities dropdown list demo
										//================================================
										level2_List = data[m].city;
									} else {
										//============ Sort object then subsort further demo
										//================================================
										level2_List = data[m].list;
									}

									var _curLevel2Items   = [],
										_curLevel3Items   = [],
										_curLevel2IDs     = [],
										_curLevel3IDs     = [];


									for ( var i = 0; i < level2_List.length; i++ ) {



										if ( typeof data[0].list === typeof undefined ) {
											//============ China cities dropdown list demo
											//================================================
											var city      = level2_List[i].name,
												area      = level2_List[i].area,
												areaIDs   = level2_List[i].areaid,
												ids       = level2_List[i].id;

											

											_curLevel2Items.push( city );
											_curLevel2IDs.push( ids );

											var _tempLevel3Items = [],
												_tempLevel3IDs   = [];
											
											if ( typeof area != typeof undefined ) {
												for ( var k = 0; k < area.length; k++ ) {
													_tempLevel3Items.push( area[k] );

												}		
											}

											if ( typeof areaIDs != typeof undefined ) {
												for ( var p = 0; p < areaIDs.length; p++ ) {
													_tempLevel3IDs.push( areaIDs[p] );

												}		
											}
											
											_curLevel3Items.push( _tempLevel3Items );
											_curLevel3IDs.push( _tempLevel3IDs );


										} else {
											//============ Sort object then subsort further demo
											//================================================
											var sort1    = level2_List[i].name,
												sortID   = level2_List[i].id;

											_curLevel2Items.push( sort1 );
											_curLevel2IDs.push( sortID );
										}



									}// end for

									_level2.push( _curLevel2Items );
									_level3.push( _curLevel3Items );
									
									_level2IDs.push( _curLevel2IDs );
									_level3IDs.push( _curLevel3IDs );									
									

								}// end for



								function initSelectControls() {
									var allLevel1Items           = _level1,
										allLevel2Items           = _level2,
										allLevel3Items           = _level3,
										allLevel1IDs             = _level1IDs,
										allLevel2IDs             = _level2IDs,
										allLevel3IDs             = _level3IDs,
										$level1El                = $this,
										$level2El                = $( associated ),
										$level3El                = $( associated2 ),
										level1EmptyOption        = '<option value="">' + emptyTxt1 + '</option>',
										level2EmptyOption        = '<option value="">' + emptyTxt2 + '</option>',
										level3EmptyOption        = '<option value="">' + emptyTxt3 + '</option>',
										defaultLevel1Val         = $this.val(),
										defaultLevel2Val         = $level2El.val(),
										defaultLevel3Val         = $level3El.val(),
										isCustomSelLevel1        = $level1El.closest( '.uix-controls' ).hasClass( 'uix-controls__select' ),
										isCustomSelLevel2        = $level2El.closest( '.uix-controls' ).hasClass( 'uix-controls__select' ),
										isCustomSelLevel3        = $level3El.closest( '.uix-controls' ).hasClass( 'uix-controls__select' ),
										$level1Wrapper           = isCustomSelLevel1 ? $level1El.closest( '.uix-controls' ).parent( '.uix-controls__select-wrapper' ) : $level1El.closest( '.uix-controls' ),
										$level2Wrapper           = isCustomSelLevel2 ? $level2El.closest( '.uix-controls' ).parent( '.uix-controls__select-wrapper' ) : $level2El.closest( '.uix-controls' ),
										$level3Wrapper           = isCustomSelLevel3 ? $level3El.closest( '.uix-controls' ).parent( '.uix-controls__select-wrapper' ) : $level3El.closest( '.uix-controls' );


//									console.log( allLevel1Items );
//									console.log( allLevel2Items );
//									console.log( allLevel3Items );
									
//									console.log( allLevel1IDs );
//									console.log( allLevel2IDs );
//									console.log( allLevel3IDs );								
									

									//Clear all the drop-down list
									$level1El.empty();
									$level2El.empty();
									$level3El.empty();

									//Hide or display controls
									if ( autoExpand ) $level2Wrapper.hide();
									if ( autoExpand ) $level3Wrapper.hide();
									
							
									
									//---------- Initialize the level 1
									if ( defaultLevel1Val != '' && defaultLevel1Val != null ) {
										//Hide or display controls
										if ( autoExpand ) $level2Wrapper.show();
									}
									$level1El.append( level1EmptyOption );
									for (var i = 0; i < allLevel1Items.length; i++) {
										var _v = allLevel1Items[i],
											_id = allLevel1IDs[i];

										if ( defaultLevel1Val == _v ) {
											$level1El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "' selected>" + _v + "</option>");
										} else {
											$level1El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "'>" + _v + "</option>");
										}

									}


									//---------- Initialize the level 2
									var curLevel1Index = $level1El.find( 'option:selected' ).data( 'index' );

									if ( defaultLevel2Val != '' && defaultLevel2Val != null ) {
										//Hide or display controls
										if ( autoExpand ) $level3Wrapper.show();
									}							
									$level2El.append( level2EmptyOption );

									if ( typeof curLevel1Index != typeof undefined ) {
										for (var i = 0; i < allLevel2Items[curLevel1Index - 1].length; i++) {
											var _v = allLevel2Items[curLevel1Index - 1][i],
											    _id = allLevel2IDs[curLevel1Index - 1][i];
  

											if ( defaultLevel2Val == _v ) {
												$level2El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "' selected>" + _v + "</option>");
											} else {
												$level2El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "'>" + _v + "</option>");
											}
										}		
									}


									//---------- Initialization level 3
									var curLevel2Index = $level2El.find( 'option:selected' ).data( 'index' );
									$level3El.append( level3EmptyOption );

									if ( typeof curLevel2Index != typeof undefined ) {
										for (var i = 0; i < allLevel3Items[curLevel1Index - 1][curLevel2Index - 1].length; i++) {
											var _v = allLevel3Items[curLevel1Index - 1][curLevel2Index - 1][i],
											    _id = allLevel3IDs[curLevel1Index - 1][curLevel2Index - 1][i];


											if ( defaultLevel3Val == _v ) {
												$level3El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "' selected>" + _v + "</option>");
											} else {
												$level3El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "'>" + _v + "</option>");
											}
										}

									}


									//---------- Render the custom select
									$( document ).UixRenderCustomSelect();
									$level1El.attr( 'selected', 'selected' ).change();
									$level2El.attr( 'selected', 'selected' ).change();
									$level3El.attr( 'selected', 'selected' ).change();




									//---------- Change event level 1
									$level1El.on( 'change.DYNAMIC_DD_LIST', function() {
										//Clear all the level 2 and level 3 items in the drop-down list
										$level2El.empty();
										$level3El.empty();

									
										//Add a option with a value of 0
										$level2El.append( level2EmptyOption );
										$level3El.append( level3EmptyOption );


										//Hide or display controls
										if ( autoExpand ) $level2Wrapper.show();
										


										//Set the current subscript of the selected option and assign
										var level1Index = $(this).find( 'option:selected' ).data( 'index' );
										var level2Items = allLevel2Items[level1Index - 1];
										var level2IDs = allLevel2IDs[level1Index - 1];

										if ( typeof level2Items != typeof undefined ) {
											for (var i = 0; i < level2Items.length; i++) {
												var _v = level2Items[i],
											        _id = level2IDs[i];

												$level2El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "'>" + _v + "</option>");
											}			
										} else {
											//Hide or display controls
											if ( autoExpand ) $level2Wrapper.hide();
										}
										
										//Render the custom select
										$( document ).UixRenderCustomSelect();
										$level2El.attr( 'selected', 'selected' ).change();
										

									});


									//---------- Change event level 2
									$level2El.on( 'change.DYNAMIC_DD_LIST', function() {
										//Clear all the level 3 items in the drop-down list
										$level3El.empty();

										
										//Add a option with a value of 0
										$level3El.append( level3EmptyOption );
										
										
										//Hide or display controls
										if ( autoExpand ) $level3Wrapper.show();
										
										

										//Get the subscript corresponding to the level 1 and level 2 at this time
										var level1Index = $level1El.find( 'option:selected' ).data( 'index' );
										var level2Index = $(this).find( 'option:selected' ).data( 'index' );
										
										
										
										if ( typeof level1Index != typeof undefined && typeof level2Index != typeof undefined ) {
											var level3Items = allLevel3Items[level1Index - 1][level2Index - 1];
											var level3IDs = allLevel3IDs[level1Index - 1][level2Index - 1];

											if ( typeof level3Items != typeof undefined ) {
												for (var i = 0; i < level3Items.length; i++) {
													var _v = level3Items[i],
											            _id = level3IDs[i];

													$level3El.append("<option data-index='" + (i + 1) + "' data-id='" + _id + "' value='" + _v + "'>" + _v + "</option>");
												}		
											}	
										} else {
											
											//Hide or display controls
											if ( autoExpand ) $level3Wrapper.hide();
											
										}
										
										
										
										//Render the custom select
										$( document ).UixRenderCustomSelect();
										$level3El.attr( 'selected', 'selected' ).change();

									});	



								}


								initSelectControls();
							



						 },
						 error  : function() {


						 }
					});



					//Prevent the form from being initialized again
					$this.data( 'exist', 1 );	
				}


				
			} // end of jsonFile
			
			
			
		});
		
		
			
				
    };

    APP.components.documentReady.push( APP.DYNAMIC_DD_LIST.documentReady );
    return APP;

}( APP, jQuery, window, document ) );






/*
 * Search string from JSON data
 * @Format reference: assets/json/countries.json
 *
 * @param  {Function} callback               - Return function after successful loading of JSON file.
 * @param  {String} jsonFile                 - The path to the JSON file.
 * @param  {String} key                      - Target key of the JSON data.
 * @return {Function}                        - Return a callback function.
 */
( function ( $ ) {
    $.fn.UixSearchJsonStr = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
			method    : 'POST',
			callback  : null,
			jsonFile  : '',
			key       : 'attributes'
        }, options );
 
        this.each( function() {
			
			var obj = $( this );
			
			
			//Returns JSON data
			$.ajax({
				url      : settings.jsonFile,
				method   : settings.method,
				dataType : 'json',
				success  : function ( data ) { 

					var newArr = [];
					
					//Convert JSON to an array
					var formatFromServer = function formatFromServer( data ) {
						var formatData = {};

						for ( var item in data ) {
							if ( $( document ).UixIsJsonObj( { string:  data[item] } ) ) {
								formatFromServer( data[item], formatData );
							} else {
								formatData[item] = data[item];
							}
						}

						for ( var item2 in formatData ) {
							//console.log( formatData[ item2 ] );
							newArr.push( formatData[ item2 ] );
						}



						return formatData;
					};

					formatFromServer( data );


					//search JSON key that contains specific string
					for ( var p = 0; p < newArr.length; p++ ) {
						
						for ( var n = 0; n < newArr[p].list.length; n++ ) {
							
							if ( Object.prototype.toString.call( newArr[p].list[n][settings.key] ) =='[object Array]' ) {
								
								// API: Callback
								settings.callback( newArr[p].list[n][settings.key] );

							}


						}


					}



				 },
				 error  : function() {


				 }
			});

			
		});
 
    };
 
}( jQuery ));



/*
 * Check if a string is a valid JSON string
 * Note: Used when certain functions use "JSON.parse"
 *
 * @param  {String} string                   - A json arbitrary string
 * @return {Boolean}                         - Return a boolean.
 */
( function ( $ ) {
    $.fn.UixIsJsonObj = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
			string    : ''
        }, options );
 
        this.each( function() {
			
			var str = settings.str;

			if ( typeof( str ) == 'string' && str.length > 0 ) {

				if ( str.replace( /\"\"/g, '' ).replace( /\,/g, '' ) == '[{}]' ) {
					return false;
				} else {

					if (/^[\],:{}\s]*$/.test( str.replace(/\\["\\\/bfnrtu]/g, '@' ).
					replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

						return true;

					}else{

						return false;

					}	

				}

			} else {
				return false;
			}
			
			
		});
 
    };
 
}( jQuery ));
