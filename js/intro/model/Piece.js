// Copyright 2017, University of Colorado Boulder

/**
 * Piece model in 'Fractions-Intro' simulation.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Piece( options ) {

    options = _.extend( {
      position: new Vector2( 0, 0 ), // {Vector2} initial position
      dragging: false // {boolean} is the user dragging the point?
    }, options );

    var self = this;

    // @public {Property.<Vector2>} position of point
    this.positionProperty = new Property( options.position );

    this.destinationCellProperty = new Property( null );

    // @public {Property.<boolean>}
    this.draggingProperty = new BooleanProperty( options.dragging ); // {boolean} is the user dragging the point?

    // @private {boolean} is the point animated by external means (say TWEEN). Animated points are not used for curve fits
    this.animated = false;

    // create emitter that will signal that the piece has returned to the bucket
    this.returnToOriginEmitter = new Emitter();

    this.draggingProperty.link( function( dragging ) {
      if ( !dragging ) {
        self.animate();
      }
    } );
  }

  fractionsIntro.register( 'Piece', Piece );

  return inherit( Object, Piece, {

    /**
     * Animates the piece back to its original position (inside the bucket).
     *
     * @public
     */
    animate: function() {

      var self = this;
      this.animated = true;

      var location = {
        x: this.positionProperty.value.x,
        y: this.positionProperty.value.y
      };

      // distance to the origin
      var distance = this.positionProperty.initialValue.distance( this.positionProperty.value );

      if ( distance > 0 ) {
        var animationTween = new TWEEN.Tween( location )
          .to( { x: this.positionProperty.initialValue.x, y: this.positionProperty.initialValue.y },
            distance / 1 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            self.positionProperty.set( new Vector2( location.x, location.y ) );
          } )
          .onComplete( function() {
            self.animated = false;
            self.returnToOriginEmitter.emit();
          } );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {
        // for cases where the distance is zero
        self.animated = false;
        self.returnToOriginEmitter.emit();
      }
    }
  } );
} );