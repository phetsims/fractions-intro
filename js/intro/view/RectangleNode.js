// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Rectangle}
   *
   * @param {number} denominator
   */
  function RectangleNode( denominator ) {
    Rectangle.call( this, {
      rectWidth: IntroConstants.RECTANGULAR_SIZE.width,
      rectHeight: IntroConstants.RECTANGULAR_SIZE.height / denominator,
      fill: '#FFE600',
      stroke: 'black',
      lineWidth: 2
    } );

    // @public {Vector2}
    this.midpointOffset = this.center;
  }

  fractionsIntro.register( 'RectangleNode', RectangleNode );

  return inherit( Rectangle, RectangleNode );
} );
