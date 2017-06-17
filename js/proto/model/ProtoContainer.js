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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var ProtoCell = require( 'FRACTIONS_INTRO/proto/model/ProtoCell' );

  /**
   * @constructor
   * @extends {Object}
   */
  function ProtoContainer() {
    var self = this;

    // @public {ObservableArray.<ProtoCell>}
    this.cells = new ObservableArray();

    // @public {Property.<boolean>}
    this.filledCellCountProperty = new NumberProperty( 0 );

    function fillChange( filled ) {
      if ( filled ) {
        self.filledCellCountProperty.value += 1;
      }
      else {
        self.filledCellCountProperty.value -= 1;
      }
    }

    // When a cell is added, listen to when its fill changes
    this.cells.addItemAddedListener( function( cell ) {
      // If it's already filled, increment
      if ( cell.isFilledProperty.value ) {
        self.filledCellCountProperty.value += 1;
      }
      cell.isFilledProperty.lazyLink( fillChange );
    } );

    // When a cell is removed, stop listening to its fill changes
    this.cells.addItemRemovedListener( function( cell ) {
      cell.isFilledProperty.unlink( fillChange );

      // If it's filled, decrement
      if ( cell.isFilledProperty.value ) {
        self.filledCellCountProperty.value -= 1;
      }
    } );
  }

  fractionsIntro.register( 'ProtoContainer', ProtoContainer );

  return inherit( Object, ProtoContainer, {
    /**
     * Adds a certain number of empty cells.
     * @public
     *
     * @param {number} quantity
     */
    addCells: function( quantity ) {
      var self = this;
      _.times( quantity, function() {
        self.cells.push( new ProtoCell( self, self.cells.length ) );
      } );
    },

    /**
     * Removes a certain number of cells, attempting to redistribute any filled ones to empty cells.
     * @public
     *
     * @param {number} quantity
     * @returns {number} - The number of filled cells removed that couldn't be handled by filling another empty cell.
     */
    removeCells: function( quantity ) {
      var self = this;
      var removedCount = 0;

      _.times( quantity, function() {
        var removedCell = self.cells.pop();

        // If the removed cell is filled, we need to find another cell to fill
        if ( removedCell.isFilledProperty.value ) {
          var cell = self.getNextEmptyCell();

          if ( cell ) {
            cell.fill();
          }
          else {
            removedCount++;
          }
        }
      } );

      return removedCount;
    },

    // {ProtoCell|null}
    getNextEmptyCell: function() {
      for ( var i = 0; i < this.cells.length; i++ ) {
        var cell = this.cells.get( i );
        if ( !cell.isFilledProperty.value ) {
          return cell;
        }
      }
      return null;
    },

    // {ProtoCell|null}
    getNextFilledCell: function() {
      for ( var i = this.cells.length - 1; i >= 0; i-- ) {
        var cell = this.cells.get( i );
        if ( cell.isFilledProperty.value ) {
          return cell;
        }
      }
      return null;
    }
  } );
} );
