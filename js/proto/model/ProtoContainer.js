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
    // @public {ObservableArray.<ProtoCell>}
    this.cells = new ObservableArray();

    // @public {Property.<boolean>} TODO: better way?
    this.filledCellCountProperty = new NumberProperty( 0 );
  }

  fractionsIntro.register( 'ProtoContainer', ProtoContainer );

  return inherit( Object, ProtoContainer, {
    addCells: function( quantity ) {
      var self = this;
      _.times( quantity, function() {
        self.cells.push( new ProtoCell() );
      } );
    },
    removeCells: function( quantity ) {
      var removedCount = 0;

      while ( quantity > 0 ) {
        var lastCell = this.cells.get( this.cells.length - 1 );
        // TODO: removing cell, do something to get rid of a value?
        if ( lastCell.isFilledProperty.value ) {
          this.filledCellCountProperty.value -= 1;

          if ( this.hasEmptyCell() ) {
            this.fillNextCell();
          }
          else {
            removedCount++;
          }
        }
        this.cells.pop();
        quantity -= 1;
      }

      return removedCount;
    },
    hasEmptyCell: function() {
      return _.some( this.cells.getArray(), function( cell ) {
        return !cell.isFilledProperty.value;
      } );
    },
    hasFilledCell: function() {
      return _.some( this.cells.getArray(), function( cell ) {
        return cell.isFilledProperty.value;
      } );
    },
    fillNextCell: function() {
      for ( var i = 0; i < this.cells.length; i++ ) {
        var cell = this.cells.get( i );
        if ( !cell.isFilledProperty.value ) {
          cell.isFilledProperty.value = true;
          this.filledCellCountProperty.value += 1;
          return;
        }
      }
    },
    emptyNextCell: function() {
      for ( var i = this.cells.length - 1; i >= 0; i-- ) {
        var cell = this.cells.get( i );
        if ( cell.isFilledProperty.value ) {
          cell.isFilledProperty.value = false;
          this.filledCellCountProperty.value -= 1;
          //TODO: interrupt animation? (link up somewhere)
          return;
        }
      }
    }
  } );
} );
