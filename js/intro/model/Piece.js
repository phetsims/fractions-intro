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
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
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

    // @public {Property.<Cell|null>} the destination cell for the piece
    this.cellToProperty = new Property( null );

    // @public {Property.<Cell|null>} the origin cell of the piece
    this.cellFromProperty = new Property( null );

    // @public {Property.<boolean>}
    this.draggingProperty = new BooleanProperty( options.dragging ); // {boolean} is the user dragging the piece?

    // create emitter that will signal that the piece has reached its destination
    this.reachedDestinationEmitter = new Emitter();

    // create emitter that will signal the the piece has reached its cell.
    this.updateCellsEmitter = new Emitter();

    // animate piece from its current position to the cell
    // callback triggerToCell will update the status of the cell
    var animateToCell = function( cell ) {
      if ( cell !== null ) {
        self.animateToAndFrom( self.positionProperty.value, cell.positionProperty.value, {
          onComplete: function() {
            self.triggerToCell();
          }
        } );
      }
    };

    // animate piece from its current position to the cell
    this.cellToProperty.link( animateToCell );

    // sets the CELL incomingPiece property to THIS piece.
    var pairCellToDestination = function( cell ) {
      if ( cell !== null ) {
        cell.pieceToProperty.value = self;
      }
    };

    // listener that is responsible for animating a piece from cell towards the bucket
    var animateFromCell = function( cell ) {
      if ( cell !== null ) {

        // update the fill status of the cell we are leaving from
        cell.isFilledProperty.value = false;

        // force an update of the view
        self.updateCellsEmitter.emit();

        // animate from the cell to the bucket
        self.animateToAndFrom( cell.positionProperty.value, IntroConstants.BUCKET_POSITION );

        // sets the value of the cellFrom to null
        self.cellFromProperty.value = null;
      }
    };

    // ensure that the destination cell and this piece are mutually locked in.
    this.cellToProperty.link( pairCellToDestination );

    // animate the piece from the cell to the bucket
    this.cellFromProperty.link( animateFromCell );

    // dispose function for this type
    this.disposePiece = function() {
      self.cellToProperty.unlink( animateToCell );
      self.cellToProperty.unlink( pairCellToDestination );
      self.cellFromProperty.unlink( animateFromCell );
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
      this.cellToProperty.reset();
      this.cellFromProperty.reset();
    },

    /**
     * dispose of this piece
     * @public
     */
    dispose: function() {
      this.disposePiece();
    },

    /**
     * callback to trigger upon completion of the animation TO a cell
     * @private
     */
    triggerToCell: function() {

      var destinationCell = this.cellToProperty.value;

      // change state of cell to filled and reset its pieceToProperty
      destinationCell.fillWithPiece();

      // sets the destination cell to null
      this.cellToProperty.value = null;

      // updates the view of the cells and containers
      this.updateCellsEmitter.emit();

    },

    /**
     * Animates the piece from an initialPosition to a finalPosition
     * @param {Vector2} initialPosition
     * @param {Vector2} finalPosition
     * @param {Object} [options]
     * @public
     */
    animateToAndFrom: function( initialPosition, finalPosition, options ) {

      options = _.extend( {
        onComplete: function() {}  // callback to be performed upon completion of the animation
      }, options );

      var self = this;

      this.draggingProperty.value = false;

      var location = {
        x: initialPosition.x,
        y: initialPosition.y
      };

      // distance to the final position
      var distance = finalPosition.distance( initialPosition );

      if ( distance > 0 ) {
        var animationTween = new TWEEN.Tween( location )
          .to( { x: finalPosition.x, y: finalPosition.y },
            distance * 5 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            self.positionProperty.value = new Vector2( location.x, location.y );
          } )
          .onComplete( function() {

            options.onComplete();

            // the piece can be removed from the pieces observable array
            self.reachedDestinationEmitter.emit();
          } );

        animationTween.start( phet.joist.elapsedTime );
      }
      else {

        // for cases where the distance is zero

        //  optional call back
        options.onComplete();

        // the piece can be removed from the pieces observable array
        self.reachedDestinationEmitter.emit();
      }
    }
  } );
} );