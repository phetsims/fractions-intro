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

    // @public {Property.<Cell|null>}
    this.destinationCellProperty = new Property( null );

    // @public {Property.<boolean>}
    this.draggingProperty = new BooleanProperty( options.dragging ); // {boolean} is the user dragging the piece?

    // create emitter that will signal that the piece has reached its destination
    this.reachedDestinationEmitter = new Emitter();

    // create emitter that will signal the the piece has reached its cell.
    this.updateCellsEmitter = new Emitter();

    // tween animation for cell
    var animateCell = function( cell ) {
      if ( !(cell === null ) ) {
        self.animateToCell( cell );
      }
    };

    this.destinationCellProperty.link( animateCell );

    // dispose function for this type
    this.disposePiece = function() {
      self.destinationCellProperty.unlink( animateCell );
    };
  }

  fractionsIntro.register( 'Piece', Piece );

  return inherit( Object, Piece, {
    /**
     * reset the property of this piece
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.draggingProperty.reset();
      this.destinationCellProperty.reset();
    },

    /**
     * @public
     */
    dispose: function() {
      this.disposePiece();
    },

    //TODO: consolidate animateToCell and animateToBucket
    /**
     * Animates the piece to a cell
     * @param {Cell} cell
     * @public
     */
    animateToCell: function( cell ) {

      this.draggingProperty.value = false;

      var self = this;

      var onCompletion = function() {
        cell.isFilledProperty.value = true;
        self.reachedDestinationEmitter.emit();
        self.updateCellsEmitter.emit();
        self.destinationCellProperty.set( null );
      };

      var finalPosition = cell.positionProperty.value;

      // distance to the final position
      var distance = finalPosition.distance( this.positionProperty.value );

      var finalDestination = {
        x: finalPosition.x,
        y: finalPosition.y
      };

      var location = {
        x: this.positionProperty.value.x,
        y: this.positionProperty.value.y
      };

      if ( distance > 0 ) {
        var animationTween = new TWEEN.Tween( location )
          .to( finalDestination, distance * 10 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            self.positionProperty.set( new Vector2( location.x, location.y ) );
          } )
          .onComplete( onCompletion );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {

        // for cases where the distance is zero
        onCompletion();
      }

    },

    /**
     * Animates the piece back to the bucket
     * @param {Vector2} finalPosition
     * @public
     */
    animateToBucket: function( finalPosition ) {

      var self = this;

      this.draggingProperty.value = false;

      var location = {
        x: this.positionProperty.value.x,
        y: this.positionProperty.value.y
      };

      // distance to the final position
      var distance = finalPosition.distance( this.positionProperty.value );

      if ( distance > 0 ) {
        var animationTween = new TWEEN.Tween( location )
          .to( { x: finalPosition.x, y: finalPosition.y },
            distance * 10 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            self.positionProperty.set( new Vector2( location.x, location.y ) );
          } )
          .onComplete( function() {
            self.reachedDestinationEmitter.emit();
            self.updateCellsEmitter.emit();
          } );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {
        // for cases where the distance is zero
        self.reachedDestinationEmitter.emit();
      }
    }

  } );
} )
;