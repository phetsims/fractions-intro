// Copyright 2017, University of Colorado Boulder

/**
 * draw the rectangle
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
        dropShadowOffset: 5,
        rectangle_orientation: 'vertical'
      },
      options );

    // determine the size of the rectangle size and pieces in th bucket depend upon the representation
    if ( options.rectangle_orientation === 'horizontal' ) {
      var rectangle = IntroConstants.HORIZONTAL_RECTANGULAR_SIZE;
      var rectangleWidth = rectangle.width / denominator;
      var rectangleHeight = rectangle.height;
    }
    else {
      rectangle = IntroConstants.VERTICAL_RECTANGULAR_SIZE;
      rectangleWidth = rectangle.width;
      rectangleHeight = rectangle.height / denominator;
    }

    var foregroundRectangle = new Rectangle( {
      rectWidth: rectangleWidth,
      rectHeight: rectangleHeight,

      // determine the color depend upon representation
      fill: options.rectangle_orientation === 'horizontal' ? '#ED4344' : '#FFE600',
      stroke: 'black',
      lineWidth: 2
    } );

    options.children = [ foregroundRectangle ];

    // creates dropShadow
    if ( options.dropShadow ) {
      var backgroundRectangle = new Rectangle( {
        center: foregroundRectangle.center.plusXY( options.dropShadowOffset, options.dropShadowOffset ),
        rectWidth: rectangleWidth,
        rectHeight: rectangleHeight,
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
