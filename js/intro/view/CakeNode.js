// Copyright 2017, University of Colorado Boulder

/**
 * Node for creating Cake in fractions-intro
 * @author Michael Moorer (Berea College)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  // images
  var cake_1_1Image = require( 'image!FRACTIONS_INTRO/cake_1_1.png' );

  var cake_2_1Image = require( 'image!FRACTIONS_INTRO/cake_2_1.png' );
  var cake_2_2Image = require( 'image!FRACTIONS_INTRO/cake_2_2.png' );

  var cake_3_1Image = require( 'image!FRACTIONS_INTRO/cake_3_1.png' );
  var cake_3_2Image = require( 'image!FRACTIONS_INTRO/cake_3_2.png' );
  var cake_3_3Image = require( 'image!FRACTIONS_INTRO/cake_3_3.png' );

  var cake_4_1Image = require( 'image!FRACTIONS_INTRO/cake_4_1.png' );
  var cake_4_2Image = require( 'image!FRACTIONS_INTRO/cake_4_2.png' );
  var cake_4_3Image = require( 'image!FRACTIONS_INTRO/cake_4_3.png' );
  var cake_4_4Image = require( 'image!FRACTIONS_INTRO/cake_4_4.png' );

  var cake_5_1Image = require( 'image!FRACTIONS_INTRO/cake_5_1.png' );
  var cake_5_2Image = require( 'image!FRACTIONS_INTRO/cake_5_2.png' );
  var cake_5_3Image = require( 'image!FRACTIONS_INTRO/cake_5_3.png' );
  var cake_5_4Image = require( 'image!FRACTIONS_INTRO/cake_5_4.png' );
  var cake_5_5Image = require( 'image!FRACTIONS_INTRO/cake_5_5.png' );

  var cake_6_1Image = require( 'image!FRACTIONS_INTRO/cake_6_1.png' );
  var cake_6_2Image = require( 'image!FRACTIONS_INTRO/cake_6_2.png' );
  var cake_6_3Image = require( 'image!FRACTIONS_INTRO/cake_6_3.png' );
  var cake_6_4Image = require( 'image!FRACTIONS_INTRO/cake_6_4.png' );
  var cake_6_5Image = require( 'image!FRACTIONS_INTRO/cake_6_5.png' );
  var cake_6_6Image = require( 'image!FRACTIONS_INTRO/cake_6_6.png' );

  var cake_7_1Image = require( 'image!FRACTIONS_INTRO/cake_7_1.png' );
  var cake_7_2Image = require( 'image!FRACTIONS_INTRO/cake_7_2.png' );
  var cake_7_3Image = require( 'image!FRACTIONS_INTRO/cake_7_3.png' );
  var cake_7_4Image = require( 'image!FRACTIONS_INTRO/cake_7_4.png' );
  var cake_7_5Image = require( 'image!FRACTIONS_INTRO/cake_7_5.png' );
  var cake_7_6Image = require( 'image!FRACTIONS_INTRO/cake_7_6.png' );
  var cake_7_7Image = require( 'image!FRACTIONS_INTRO/cake_7_7.png' );

  var cake_8_1Image = require( 'image!FRACTIONS_INTRO/cake_8_1.png' );
  var cake_8_2Image = require( 'image!FRACTIONS_INTRO/cake_8_2.png' );
  var cake_8_3Image = require( 'image!FRACTIONS_INTRO/cake_8_3.png' );
  var cake_8_4Image = require( 'image!FRACTIONS_INTRO/cake_8_4.png' );
  var cake_8_5Image = require( 'image!FRACTIONS_INTRO/cake_8_5.png' );
  var cake_8_6Image = require( 'image!FRACTIONS_INTRO/cake_8_6.png' );
  var cake_8_7Image = require( 'image!FRACTIONS_INTRO/cake_8_7.png' );
  var cake_8_8Image = require( 'image!FRACTIONS_INTRO/cake_8_8.png' );

  var cake_grid_1Image = require( 'image!FRACTIONS_INTRO/cake_grid_1.png' );
  var cake_grid_2Image = require( 'image!FRACTIONS_INTRO/cake_grid_2.png' );
  var cake_grid_3Image = require( 'image!FRACTIONS_INTRO/cake_grid_3.png' );
  var cake_grid_4Image = require( 'image!FRACTIONS_INTRO/cake_grid_4.png' );
  var cake_grid_5Image = require( 'image!FRACTIONS_INTRO/cake_grid_5.png' );
  var cake_grid_6Image = require( 'image!FRACTIONS_INTRO/cake_grid_6.png' );
  var cake_grid_7Image = require( 'image!FRACTIONS_INTRO/cake_grid_7.png' );
  var cake_grid_8Image = require( 'image!FRACTIONS_INTRO/cake_grid_8.png' );

  /**
   *
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {object} [options]
   * @constructor
   */
  function CakeNode( numeratorProperty, denominatorProperty, options ) {

    options = _.extend( {
      maxHeight: 160,
      visibleBackground: true
    }, options );

    Node.call( this );
    var self = this;

    var cakeImageArray = [
      [ cake_1_1Image ],
      [ cake_2_1Image, cake_2_2Image ],
      [ cake_3_1Image, cake_3_2Image, cake_3_3Image ],
      [ cake_4_1Image, cake_4_2Image, cake_4_3Image, cake_4_4Image ],
      [ cake_5_1Image, cake_5_2Image, cake_5_3Image, cake_5_4Image, cake_5_5Image ],
      [ cake_6_1Image, cake_6_2Image, cake_6_3Image, cake_6_4Image, cake_6_5Image, cake_6_6Image ],
      [ cake_7_1Image, cake_7_2Image, cake_7_3Image, cake_7_4Image, cake_7_5Image, cake_7_6Image, cake_7_7Image ],
      [ cake_8_1Image, cake_8_2Image, cake_8_3Image, cake_8_4Image, cake_8_5Image, cake_8_6Image, cake_8_7Image,
        cake_8_8Image ]
    ];

    var cakeGridImageArray = [
      cake_grid_1Image,
      cake_grid_2Image,
      cake_grid_3Image,
      cake_grid_4Image,
      cake_grid_5Image,
      cake_grid_6Image,
      cake_grid_7Image,
      cake_grid_8Image
    ];

    /**
     * returns a scenery Node with slices of a cake and a grid
     * @param {number} numerator
     * @param {number} denominator
     * @returns {Node}
     */
    var createCakeNode = function( numerator, denominator ) {

      var cakeNode = new Node();

      if ( options.visibleBackground ) {

        // add grid image of the cake
        var gridImage = new Image( cakeGridImageArray[ denominator - 1 ], {} );

        var cakeNodeBackground = new Node();
        cakeNode.addChild( cakeNodeBackground );

        // create white background for the cake. The shape of the ellipse is determined empirically based on the image
        var cakeGridBase = new Path( Shape.ellipse(
          gridImage.width / 2,
          gridImage.height * 0.635,
          gridImage.width * 0.364,
          gridImage.height * 0.277, 0 ), {
          fill: 'white'
        } );

        // cakeGridBase is ordered at the bottom of the z-layer
        cakeNodeBackground.addChild( cakeGridBase );

        cakeNodeBackground.addChild( gridImage );

      }

      var cakeSlicesNode = new Node();
      cakeNode.addChild( cakeSlicesNode );

      // TODO: generalize for multiple cakes (max)
      var numberOfSlices = (numerator < denominator) ? numerator : denominator;

      // Each array corresponds to the z layers of the cake slices
      // The higher the value in the array, the higher the z-order level
      // For instance for a denominator of 2, the array [1,0] indicates that
      // the 0th element has a z value of 1 and is on top of the 1st element whose z value is 0
      function zLayerOrder( denominator ) {
        switch( denominator ) {
          case 1:
            return [ 0 ];
          case 2:
            return [ 1, 0 ];
          case 3:
            return [ 0, 1, 2 ];
          case 4:
            return [ 0, 1, 2, 3 ];
          case 5:
            return [ 1, 0, 2, 4, 3 ];
          case 6:
            return [ 1, 0, 2, 3, 5, 4 ];
          case 7:
            return [ 1, 0, 2, 3, 4, 6, 5 ];
          case 8:
            return [ 1, 0, 2, 3, 4, 5, 7, 6 ];
          default:
            throw new Error( 'Unknown denominator: ' + denominator );
        }
      }

      var indexArray = zLayerOrder( denominator );

      // array of cake slices where z-order is chronological
      var cakeLayerArray = [];

      // add slices of cake to the cakeLayerArray
      for ( var sliceIndex = 0; sliceIndex < numberOfSlices; sliceIndex++ ) {

        // fetch image based on the denominator and the slice number
        var cakeImage = new Image( cakeImageArray[ denominator - 1 ][ sliceIndex ] );
        cakeLayerArray.push( cakeImage );
      }

      // create an array to place the reordered cake slices into
      var cakeLayerOrderArray = new Array( 8 );
      for ( var i = 0; i < cakeLayerArray.length; i++ ) {
        cakeLayerOrderArray[ indexArray[ i ] ] = cakeLayerArray[ i ];
      }

      // remove all undefined 'slices'
      cakeLayerOrderArray = cakeLayerOrderArray.filter( function( n ) { return n !== undefined; } );

      // setChildren crashes if you pass an empty list
      if ( cakeLayerOrderArray.length > 0 ) {
        cakeSlicesNode.setChildren( cakeLayerOrderArray );
      }

      return cakeNode;
    };

    // add cake
    Property.multilink( [ numeratorProperty, denominatorProperty ], function( numerator, denominator ) {
      self.removeAllChildren();
      self.addChild( createCakeNode( numerator, denominator ) );
    } );

    this.mutate( options );
  }

  fractionsIntro.register( 'CakeNode', CakeNode );

  return inherit( Node, CakeNode );
} )
;

