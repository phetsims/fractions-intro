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
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {number} denominator
   * @param {number} index
   * @param {Object} [options]
   */
  function CircleNode( denominator, index, options ) {
    assert && assert( index < denominator );

    options = _.extend( {
        fill: 'rgb(140, 198, 61)',
        stroke: 'black',
        dropShadow: false,
        dropShadowOffset: 5,
        lineWidth: 2,
        isIcon: false
      },
      options );
    options.lineWidth = options.isIcon ? 1 : 2;

    // @private
    this.denominator = denominator;
    this.angleUnit = 2 * Math.PI / denominator;
    this.options = options;

    var startAngle = index * this.angleUnit;
    var endAngle = startAngle + this.angleUnit;

    var shape = new Shape();
    if ( denominator > 1 ) {
      shape.moveTo( 0, 0 );
    }
    var circleRadius = options.isIcon ? IntroConstants.CIRCULAR_RADIUS / 4 : IntroConstants.CIRCULAR_RADIUS;
    shape.arc( 0, 0, circleRadius, startAngle, endAngle, false ).close();

    Node.call( this );

    this.foregroundSector = new Path( shape, options );
    if ( options.dropShadow ) {
      this.backgroundSector = new Path( shape, { fill: 'black' } );
      this.backgroundSector.center = this.foregroundSector.center.plusScalar( options.dropShadowOffset );
      this.addChild( this.backgroundSector );
    }
    this.addChild( this.foregroundSector );

    // @public {Vector2}
    this.midpointOffset = denominator === 1 ? Vector2.ZERO : Vector2.createPolar( IntroConstants.CIRCULAR_RADIUS / 2, this.angleUnit / 2 + startAngle );
  }

  fractionsIntro.register( 'CircleNode', CircleNode );

  return inherit( Node, CircleNode, {
    /**
     *
     * @param {number} angle
     * @public
     */
    rotateCircle: function( angle ) {
      this.foregroundSector.rotation = angle;
      if ( this.options.dropShadow ) {
        this.backgroundSector.rotation = angle;
        this.backgroundSector.x = this.foregroundSector.x + 5;
      }
      this.midpointOffset = this.denominator === 1 ? Vector2.ZERO : Vector2.createPolar( IntroConstants.CIRCULAR_RADIUS / 2, this.angleUnit / 2 + angle );
    },
    /**
     *
     * @returns {number}
     * @public
     */
    getCircleRotation: function() {
      return this.foregroundSector.rotation;
    }
  } );
} );
