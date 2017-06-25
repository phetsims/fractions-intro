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
   * @extends {Node}
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

    options.children = [ foregroundRectangle ];

    // creates dropShadow
    if ( options.dropShadow ) {
      var backgroundRectangle = new Rectangle( {
        center: foregroundRectangle.center.plusXY( options.dropShadowOffset, options.dropShadowOffset ),
        rectWidth: IntroConstants.RECTANGULAR_SIZE.width,
        rectHeight: IntroConstants.RECTANGULAR_SIZE.height / denominator,
        fill: 'black',
        lineWidth: 2
      } );

      options.children = [ backgroundRectangle, foregroundRectangle ];

    }

    Node.call( this, options );

    // @public {Vector2}
    this.midpointOffset = this.center;

  }

  fractionsIntro.register( 'RectangleNode', RectangleNode );

  return inherit( Node, RectangleNode );
} );
