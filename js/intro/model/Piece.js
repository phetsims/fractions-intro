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
      dragging: true // {boolean} is the user dragging the piece
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

    // tween animation for piece to cell
    var animateCell = function( cell ) {
      if ( cell !== null ) {
        self.animateToDestination( cell.positionProperty.value );
      }
    };

    this.destinationCellProperty.link( animateCell );

    // sets the CELL incomingPiece property to THIS piece.
    var pairCellToDestination = function( cell ) {
      if ( cell !== null ) {
        cell.incomingPieceProperty.value = self;
      }
    };

    // ensure that the destination cell and this piece are mutually locked in.
    this.destinationCellProperty.link( pairCellToDestination );

    // dispose function for this type
    this.disposePiece = function() {
      self.destinationCellProperty.unlink( animateCell );
      self.destinationCellProperty.unlink( pairCellToDestination );
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
     * dispose of this piece
     * @public
     */
    dispose: function() {
      this.disposePiece();
    },

    /**
     * callback to trigger upon completion of the animation
     * @private
     */
    triggerOnCompletion: function() {

      // additional actions if the piece reached a cell
      if ( this.destinationCellProperty.value !== null ) {
        var destinationCell = this.destinationCellProperty.value;

        destinationCell.isFilledProperty.value = true;

        // sets the value of incoming Piece to null
        destinationCell.incomingPieceProperty.value = null;

        // sets the destination cell to null
        this.destinationCellProperty.value = null;

        // updates the view of the cells and containers
        this.updateCellsEmitter.emit();
      }

      // the piece can be removed from the pieces observable array
      this.reachedDestinationEmitter.emit();
    },

    /**
     * Animates the piece to the destination
     * @param {Vector2} finalPosition
     * @public
     */
    animateToDestination: function( finalPosition ) {

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
            self.positionProperty.value = new Vector2( location.x, location.y );
          } )
          .onComplete( function() {
            self.triggerOnCompletion();
          } );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {

        // for cases where the distance is zero
        self.triggerOnCompletion();
      }
    }

  } );
} );