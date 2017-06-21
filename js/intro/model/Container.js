// Copyright 2017, University of Colorado Boulder

/**
 * Contains up to N cells, where N is the denominator. Represents up to N/N (N cells of 1/N each).
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
  var Cell = require( 'FRACTIONS_INTRO/intro/model/Cell' );

  /**
   * @constructor
   * @extends {Object}
   */
  function Container() {
    var self = this;

    // @public {ObservableArray.<Cell>}
    this.cells = new ObservableArray();

    // @public {Property.<boolean>} - How many cells are logically filled?
    this.filledCellCountProperty = new NumberProperty( 0 );

    // Called when a fill property changes
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

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container, {
    /**
     * Adds a certain number of empty cells.
     * @public
     *
     * @param {number} quantity
     */
    addCells: function( quantity ) {
      var self = this;
      _.times( quantity, function() {
        self.cells.push( new Cell( self, self.cells.length ) );
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

        // If the removed cell is filled, we want to find another cell to fill
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

    /**
     * Finds the next empty cell (looking at the smallest indices first).
     * @public
     *
     * @returns {Cell|null}
     */
    getNextEmptyCell: function() {
      // forwards order
      for ( var i = 0; i < this.cells.length; i++ ) {
        var cell = this.cells.get( i );
        if ( !cell.isFilledProperty.value ) {
          return cell;
        }
      }
      return null;
    },

    /**
     * Finds the next filled cell (looking at the largest indices first).
     * @public
     *
     * @returns {Cell|null}
     */
    getNextFilledCell: function() {
      // backwards order
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
