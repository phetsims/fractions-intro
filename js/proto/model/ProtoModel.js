// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
    // @public {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<number>}
    this.denominatorProperty = new NumberProperty( 1 );

    // @public {Property.<number>}
    this.maxProperty = new NumberProperty( 1 );

    // @public {ObservableArray.<ProtoContainer>}
    this.containers = new ObservableArray();

    // @private {boolean}
    this.changingManually = false;

    // @public {ObservableArray.<ProtoPiece>}
    this.pieces = new ObservableArray();

    var initialContainer = new ProtoContainer();
    initialContainer.addCells( this.denominatorProperty.value );
    this.containers.push( initialContainer );

    this.numeratorProperty.lazyLink( this.onNumeratorChange.bind( this ) );
    this.denominatorProperty.lazyLink( this.onDenominatorChange.bind( this ) );
    this.maxProperty.lazyLink( this.onMaxChange.bind( this ) );
  }

  fractionsIntro.register( 'ProtoModel', ProtoModel );

  return inherit( Object, ProtoModel, {
    // @returns a piece with the reference
    grabCell: function( cell ) {
      this.changeNumeratorManually( -1 );
      cell.empty();

      var piece = new ProtoPiece();
      this.pieces.push( piece );
      return piece;
    },

    targetPieceToCell: function( piece, cell ) {
      assert && assert( piece.destinationCellProperty.value === null );

      this.changeNumeratorManually( 1 );
      cell.targetWithPiece( piece );
    },

    untargetPiece: function( piece ) {
      assert && assert( piece.destinationCellProperty.value !== null );

      this.changeNumeratorManually( -1 );
      piece.destinationCellProperty.value.untargetFromPiece( piece );
    },

    completePiece: function( piece ) {
      var destinationCell = piece.destinationCellProperty.value;
      if ( destinationCell ) {
        destinationCell.fillWithPiece( piece );
      }
      this.pieces.remove( piece );
    },

    completeAllPieces: function() {
      while ( this.pieces.length ) {
        this.completePiece( this.pieces.get( 0 ) );
      }
    },

    fillNextCell: function() {
      var piece = new ProtoPiece();
      this.pieces.push( piece );

      for ( var i = 0; i < this.containers.length; i++ ) {
        var container = this.containers.get( i );
        var cell = container.getNextEmptyCell();

        if ( cell ) {
          cell.targetWithPiece( piece );
          return;
        }
      }

      throw new Error( 'could not fill a cell' );
    },

    emptyNextCell: function() {
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
          return;
        }
      }

      throw new Error( 'could not empty a cell' );
    },

    onMaxChange: function( newMax, oldMax ) {
      // So we don't have to worry about animating to different places
      this.completeAllPieces();

      var self = this;
      var change = Math.abs( newMax - oldMax );
      _.times( change, function() {
        if ( newMax > oldMax ) {
          var container = new ProtoContainer();
          container.addCells( self.denominatorProperty.value );
          self.containers.push( container );
        }
        else {
          var removedCount = self.containers.pop().filledCellCountProperty.value;
          _.times( removedCount, function() {
            self.fillNextCell();
          } );
        }
      } );
    },

    onNumeratorChange: function( newNumerator, oldNumerator ) {
      // Ignore changes to this if the user made a manual change
      if ( this.changingManually ) {
        return;
      }

      var self = this;
      var change = Math.abs( newNumerator - oldNumerator );
      _.times( change, function() {
        if ( newNumerator > oldNumerator ) {
          self.fillNextCell();
        }
        else {
          self.emptyNextCell();
        }
      } );
    },

    onDenominatorChange: function( newDenominator, oldDenominator ) {
      // So we don't have to worry about animating to different places
      this.completeAllPieces();

      var self = this;
      var change = Math.abs( newDenominator - oldDenominator );
      if ( newDenominator > oldDenominator ) {
        this.containers.forEach( function( container ) {
          container.addCells( change );
        } );
      }
      else {
        var removedCount = 0;
        this.containers.forEach( function( container ) {
          removedCount += container.removeCells( change );
        } );
        _.times( removedCount, function() {
          self.fillNextCell();
        } );
      }
    },

    changeNumeratorManually: function( delta ) {
      this.changingManually = true;
      this.numeratorProperty.value += delta;
      this.changingManually = false;
    },

    /**
     * Resets the entire model.
     * @public
     */
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
      this.maxProperty.reset();
    }
  } );
} );
