// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for the representation of a sector of a circle (a.k.a as a pie slice)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Path}
   *
   * @param {number} denominator
   * @param {number} index
   * @param {Object} options
   */
  function CircleNode( denominator, index, options ) {
    assert && assert( index < denominator );

    options = _.extend( {
        fill: 'rgb(140, 198, 61)',
        stroke: 'black',
        lineWidth: 2,
        isIcon: false
      },
      options );
    options.lineWidth = options.isIcon ? 1 : 2;
    var startAngle = index * 2 * Math.PI / denominator;
    var endAngle = ( index + 1 ) * 2 * Math.PI / denominator;
    var shape = new Shape();
    if ( denominator > 1 ) {
      shape.moveTo( 0, 0 );
    }
    var circleRadius = options.isIcon ? IntroConstants.CIRCULAR_RADIUS / 4 : IntroConstants.CIRCULAR_RADIUS;
    shape.arc( 0, 0, circleRadius, startAngle, endAngle, false ).close();

    Path.call( this, shape, options );

    // @public {Vector2}
    this.midpointOffset = denominator === 1 ? Vector2.ZERO : Vector2.createPolar( IntroConstants.CIRCULAR_RADIUS / 2, ( startAngle + endAngle ) / 2 );
  }

  fractionsIntro.register( 'CircleNode', CircleNode );

  return inherit( Path, CircleNode );
} );
