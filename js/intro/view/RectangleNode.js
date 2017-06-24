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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @extends {Rectangle}
   *
   * @param {number} denominator
   * @param {Object} [options]
   */
  function RectangleNode( denominator, options ) {

    options = _.extend( {
        dropShadow: false,
        dropShadowOffset: 5
      },
      options );

    var foregroundRectangle = new Rectangle( {
      rectWidth: IntroConstants.RECTANGULAR_SIZE.width,
      rectHeight: IntroConstants.RECTANGULAR_SIZE.height / denominator,
      fill: '#FFE600',
      stroke: 'black',
      lineWidth: 2
    } );

    Node.call( this, {
      children: [
        foregroundRectangle
      ]
    } );

    // creates dropShadow when option is set to true
    if ( options.dropShadow ) {

      var backgroundRectangle = new Rectangle( {
        rectWidth: IntroConstants.RECTANGULAR_SIZE.width,
        rectHeight: IntroConstants.RECTANGULAR_SIZE.height / denominator,
        center: foregroundRectangle.center.plusXY( options.dropShadowOffset, options.dropShadowOffset ),
        fill: 'black',
        stroke: 'black',
        lineWidth: 2
      } );

      this.addChild( backgroundRectangle );
      this.moveChildToBack( backgroundRectangle );
    }

    // @public {Vector2}
    this.midpointOffset = this.center;

  }

  fractionsIntro.register( 'RectangleNode', RectangleNode );

  return inherit( Node, RectangleNode );
} );
