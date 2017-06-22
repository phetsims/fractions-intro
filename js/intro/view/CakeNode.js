// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for displaying cake slices in fractions-intro
 * @author Martin Veillette (Berea College)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );

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

  /**
   * @extends {Image}
   * @param {number} denominator
   * @param {number} index
   * @param {Object} [options]
   * @constructor
   */
  function CakeNode( denominator, index, options ) {

    options = _.extend( {
      imageHeight: 160 // height of the image
    }, options );

    Image.call( this, cakeImageArray[ denominator - 1 ][ index ], options );

    // @private {number}
    this.denominator = denominator;

    // @public {Vector2}
    this.midpointOffset = new Vector2( 0, 0 );

  }

  fractionsIntro.register( 'CakeNode', CakeNode );

  return inherit( Image, CakeNode, {
    /**
     * set a new slice cake image based on its associated index
     * @public
     * @param {number} index
     */
    setCakeIndex: function( index ) {
      this.setImage( cakeImageArray[ this.denominator - 1 ][ index ] );
    }
  } );
} );

