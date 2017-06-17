// Copyright 2017, University of Colorado Boulder

/**
 * Full model for the "Intro" prototype.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var ProtoContainer = require( 'FRACTIONS_INTRO/proto/model/ProtoContainer' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var ProtoPiece = require( 'FRACTIONS_INTRO/proto/model/ProtoPiece' );

  /**
   * @constructor
   * @extends {Object}
   */
  function ProtoModel() {
    // @public {Property.<number>} - If a fraction is N/D, the numerator is the N
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<number>} - If a fraction is N/D, the numerator is the D
    this.denominatorProperty = new NumberProperty( 1 );

    // @public {Property.<number>} - What is the maximum value the fraction can have?
    this.maxProperty = new NumberProperty( 1 );

    // @public {ObservableArray.<ProtoContainer>}
    this.containers = new ObservableArray();

    // @private {boolean} - Sometimes we need to update the numerator from an internal source. When this happens,
    //                      this flag will be set to true.
    this.changingInternally = false;

    // @public {ObservableArray.<ProtoPiece>} - Pieces that are not filled cells (animating or user controlled)
    this.pieces = new ObservableArray();

    var initialContainer = new ProtoContainer();
    initialContainer.addCells( this.denominatorProperty.value );
    this.containers.push( initialContainer );

    // Hook up listeners for external notifications
    this.numeratorProperty.lazyLink( this.onNumeratorChange.bind( this ) );
    this.denominatorProperty.lazyLink( this.onDenominatorChange.bind( this ) );
    this.maxProperty.lazyLink( this.onMaxChange.bind( this ) );
  }

  fractionsIntro.register( 'ProtoModel', ProtoModel );

  return inherit( Object, ProtoModel, {
    /**
     * Called when a user grabs a cell.
     * @public
     *
     * @param {ProtoCell} cell
     * @returns {ProtoPiece} - The created piece that the user will start dragging
     */
    grabCell: function( cell ) {
      this.changeNumeratorManually( -1 );
      cell.empty();

      var piece = new ProtoPiece( this.denominatorProperty.value );
      this.pieces.push( piece );
      return piece;
    },

    /**
     * Called when a user grabs a piece from the bucket.
     * @public
     *
     * @returns {ProtoPiece} - The created piece that the user will start dragging
     */
    grabFromBucket: function() {
      var piece = new ProtoPiece( this.denominatorProperty.value );
      this.pieces.push( piece );
      return piece;
    },

    /**
     * Starts a piece animating towards the cell (counts as being filled immediately).
     * @public
     *
     * @param {ProtoPiece} piece
     * @param {ProtoCell} cell
     */
    targetPieceToCell: function( piece, cell ) {
      assert && assert( piece.destinationCellProperty.value === null );

      this.changeNumeratorManually( 1 );
      cell.targetWithPiece( piece );
    },

    /**
     * Interrupt a piece animating towards a cell (counts as being un-filled immediately).
     * @public
     *
     * @param {ProtoPiece} piece
     */
    untargetPiece: function( piece ) {
      assert && assert( piece.destinationCellProperty.value !== null );

      this.changeNumeratorManually( -1 );
      piece.destinationCellProperty.value.untargetFromPiece( piece );
    },

    /**
     * Immediately "finishes" the action of a piece, and removes it. If it was animating towards a cell, it will appear
     * filled.
     * @public
     *
     * @param {ProtoPiece} piece
     */
    completePiece: function( piece ) {
      var destinationCell = piece.destinationCellProperty.value;
      if ( destinationCell ) {
        destinationCell.fillWithPiece( piece );
      }
      this.pieces.remove( piece );
    },

    /**
     * Immediately finish the action of all pieces. Helpful for denominator/max/other changes where we want to finish
     * all animations before proceeding.
     * @public
     */
    completeAllPieces: function() {
      while ( this.pieces.length ) {
        this.completePiece( this.pieces.get( 0 ) );
      }
    },

    /**
     * Resets the entire model.
     * @public
     */
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
      this.maxProperty.reset();
    },

    /**
     * Fills the first available empty cell.
     * @private
     *
     * @param {boolean} animate - Whether the cell should animate into place (if false, will be instant)
     */
    fillNextCell: function( animate ) {
      for ( var i = 0; i < this.containers.length; i++ ) {
        var container = this.containers.get( i );
        var cell = container.getNextEmptyCell();

        if ( cell ) {
          if ( animate ) {
            var piece = new ProtoPiece( this.denominatorProperty.value );
            cell.targetWithPiece( piece );
            this.pieces.push( piece );
          }
          else {
            cell.fill();
          }
          return;
        }
      }

      throw new Error( 'could not fill a cell' );
    },

    /**
     * Empties the first available filled cell.
     * @private
     *
     * @param {boolean} animate - Whether the cell should animate to the bucket (if false, will be instant)
     */
    emptyNextCell: function( animate ) {
      for ( var i = this.containers.length - 1; i >= 0; i-- ) {
        var container = this.containers.get( i );

        var cell = container.getNextFilledCell();
        if ( cell ) {
          // If something was animating to this cell, finish the animation first
          var targetedPiece = cell.targetedPieceProperty.value;
          if ( targetedPiece ) {
            this.completePiece( targetedPiece );
          }

          cell.empty();

          if ( animate && !targetedPiece ) {
            var newPiece = new ProtoPiece( this.denominatorProperty.value );
            newPiece.originCellProperty.value = cell;
            this.pieces.push( newPiece );
          }
          return;
        }
      }

      throw new Error( 'could not empty a cell' );
    },

    /**
     * Handles a change in the 'max'.
     * @private
     *
     * @param {number} newMax
     * @param {number} oldMax
     */
    onMaxChange: function( newMax, oldMax ) {
      // So we don't have to worry about animating to different places
      this.completeAllPieces();

      var self = this;
      var change = Math.abs( newMax - oldMax );
      _.times( change, function() {
        // Increases are simple, just add a container.
        if ( newMax > oldMax ) {
          var container = new ProtoContainer();
          container.addCells( self.denominatorProperty.value );
          self.containers.push( container );
        }
        // With decreases, we may have to shift filled cells.
        else {
          var removedCount = self.containers.pop().filledCellCountProperty.value;
          _.times( removedCount, function() {
            self.fillNextCell( false );
          } );
        }
      } );
    },

    /**
     * Handles a change in the numerator.
     * @private
     *
     * @param {number} newNumerator
     * @param {number} oldNumerator
     */
    onNumeratorChange: function( newNumerator, oldNumerator ) {
      // Ignore changes to this if we made an internal change
      if ( this.changingInternally ) {
        return;
      }

      var self = this;
      var change = Math.abs( newNumerator - oldNumerator );
      _.times( change, function() {
        if ( newNumerator > oldNumerator ) {
          self.fillNextCell( true );
        }
        else {
          self.emptyNextCell( true );
        }
      } );
    },

    /**
     * Handles a change in the denominator.
     * @private
     *
     * @param {number} newNumerator
     * @param {number} oldNumerator
     */
    onDenominatorChange: function( newDenominator, oldDenominator ) {
      // So we don't have to worry about animating to different places
      this.completeAllPieces();

      var self = this;
      var change = Math.abs( newDenominator - oldDenominator );

      // Add empty cells to every container on an increase.
      if ( newDenominator > oldDenominator ) {
        this.containers.forEach( function( container ) {
          container.addCells( change );
        } );
      }
      // Rearrange filled cells on a decrease.
      else {
        var removedCount = 0;
        this.containers.forEach( function( container ) {
          removedCount += container.removeCells( change );
        } );
        _.times( removedCount, function() {
          self.fillNextCell( false );
        } );
      }
    },

    /**
     * For manually changing the numerator, where we have already applied the action to be taken manually.
     * @private
     *
     * This is in contrast to automatic changes (from spinners?) where we still have yet to take the actions to make our
     * state match internally.
     *
     * @param {number} delta - The amount to add to our numerator (may be negative)
     */
    changeNumeratorManually: function( delta ) {
      this.changingInternally = true;
      this.numeratorProperty.value += delta;
      this.changingInternally = false;
    }
  } );
} );
