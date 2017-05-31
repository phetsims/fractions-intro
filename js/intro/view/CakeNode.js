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
      maxHeight: 60
    }, options );

    Node.call( this );
    var self = this;

    var cakeImageArray = [ [], [], [], [], [], [], [], [], [] ];
    cakeImageArray[ 1 ][ 1 ] = cake_1_1Image;
    cakeImageArray[ 2 ][ 1 ] = cake_2_1Image;
    cakeImageArray[ 2 ][ 2 ] = cake_2_2Image;
    cakeImageArray[ 3 ][ 1 ] = cake_3_1Image;
    cakeImageArray[ 3 ][ 2 ] = cake_3_2Image;
    cakeImageArray[ 3 ][ 3 ] = cake_3_3Image;
    cakeImageArray[ 4 ][ 1 ] = cake_4_1Image;
    cakeImageArray[ 4 ][ 2 ] = cake_4_2Image;
    cakeImageArray[ 4 ][ 3 ] = cake_4_3Image;
    cakeImageArray[ 4 ][ 4 ] = cake_4_4Image;
    cakeImageArray[ 5 ][ 1 ] = cake_5_1Image;
    cakeImageArray[ 5 ][ 2 ] = cake_5_2Image;
    cakeImageArray[ 5 ][ 3 ] = cake_5_3Image;
    cakeImageArray[ 5 ][ 4 ] = cake_5_4Image;
    cakeImageArray[ 5 ][ 5 ] = cake_5_5Image;
    cakeImageArray[ 6 ][ 1 ] = cake_6_1Image;
    cakeImageArray[ 6 ][ 2 ] = cake_6_2Image;
    cakeImageArray[ 6 ][ 3 ] = cake_6_3Image;
    cakeImageArray[ 6 ][ 4 ] = cake_6_4Image;
    cakeImageArray[ 6 ][ 5 ] = cake_6_5Image;
    cakeImageArray[ 6 ][ 6 ] = cake_6_6Image;
    cakeImageArray[ 7 ][ 1 ] = cake_7_1Image;
    cakeImageArray[ 7 ][ 2 ] = cake_7_2Image;
    cakeImageArray[ 7 ][ 3 ] = cake_7_3Image;
    cakeImageArray[ 7 ][ 4 ] = cake_7_4Image;
    cakeImageArray[ 7 ][ 5 ] = cake_7_5Image;
    cakeImageArray[ 7 ][ 6 ] = cake_7_6Image;
    cakeImageArray[ 7 ][ 7 ] = cake_7_7Image;
    cakeImageArray[ 8 ][ 1 ] = cake_8_1Image;
    cakeImageArray[ 8 ][ 2 ] = cake_8_2Image;
    cakeImageArray[ 8 ][ 3 ] = cake_8_3Image;
    cakeImageArray[ 8 ][ 4 ] = cake_8_4Image;
    cakeImageArray[ 8 ][ 5 ] = cake_8_5Image;
    cakeImageArray[ 8 ][ 6 ] = cake_8_6Image;
    cakeImageArray[ 8 ][ 7 ] = cake_8_7Image;
    cakeImageArray[ 8 ][ 8 ] = cake_8_8Image;

    var cakeGridImageArray = [];
    cakeGridImageArray[ 1 ] = cake_grid_1Image;
    cakeGridImageArray[ 2 ] = cake_grid_2Image;
    cakeGridImageArray[ 3 ] = cake_grid_3Image;
    cakeGridImageArray[ 4 ] = cake_grid_4Image;
    cakeGridImageArray[ 5 ] = cake_grid_5Image;
    cakeGridImageArray[ 6 ] = cake_grid_6Image;
    cakeGridImageArray[ 7 ] = cake_grid_7Image;
    cakeGridImageArray[ 8 ] = cake_grid_8Image;

    /**
     * returns a scenery Node with slices of a cake and a grid
     * @param {number} numerator
     * @param {number} denominator
     * @returns {Node}
     */
    var createCakeNode = function( numerator, denominator ) {

      var cakeNode = new Node();

      // add grid image of the cake
      var gridImage = new Image( cakeGridImageArray[ denominator ],
        { maxHeight: options.maxHeight } );

      // create cake background for the cake. The shape of the ellipse is determined empirically based on the image
      var cakeGridShape = Shape.ellipse( gridImage.width / 2, gridImage.height * 0.635, gridImage.width * 0.364,
        gridImage.height * 0.277, 0 );
      var cakeGridBase = new Path( cakeGridShape, {
        fill: 'white'
      } );

      // cakeGridBase is ordered at the bottom of the z-layer
      cakeNode.addChild( cakeGridBase );

      cakeNode.addChild( gridImage );

      // TODO: generalize for multiple cakes
      var numberOfSlices = (numerator < denominator) ? numerator : denominator;

      // TODO: fix ordering of slices (read Java Simulation)

      // add slices of the cake
      for ( var sliceIndex = 1; sliceIndex <= numberOfSlices; sliceIndex++ ) {
        var cakeImage = new Image( cakeImageArray[ denominator ][ sliceIndex ],
          { maxHeight: options.maxHeight } );
        cakeNode.addChild( cakeImage );
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
} );

