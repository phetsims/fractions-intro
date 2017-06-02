// Copyright 2017, University of Colorado Boulder

/**
 * Type for a container of cells.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Cell = require( 'FRACTIONS_INTRO/intro/model/Cell' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} denominatorProperty
   * @constructor
   */
  function Container( denominatorProperty ) {

    // TODO: why passed denominatorProperty if only the value is needed

    // @public {Cells[]} an array of cells
    this.cells = [];

    // add initial cells to the container
    this.addCells( denominatorProperty.value );

    // @private {Property.<Vector2>}
    this.positionProperty = new Property( Vector2.ZERO );

  }

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container, {

    /**
     * finds closest empty cell of this container to toVector
     * @param {Vector2} toVector - the vector to find the closest cell to
     * @returns {Cell}
     * @public
     */
    getClosestEmptyCell: function( toVector ) {
      var closestCell = this.cells.reduce( function( previous, current ) {
        return (previous.distanceTo( toVector ) < current.distanceTo( toVector ) &&
                current.isFilledProperty.value === false) ? current : previous;
      }, Number.POSITIVE_INFINITY );
      return closestCell;
    },

    /**
     * get next cell to be filled
     * @returns {Cell}
     * @public
     */
    getNextEmptyCell: function() {
      for ( var index = 0; index < this.cells.length; index++ ) {
        if ( this.cells[ index ].isFilledProperty.value === false ) {
          return this.cells[ index ];
        }
      }
    },

    /**
     * get next cell to be emptied
     * @returns {Cell}
     * @public
     */
    getNextFilledCell: function() {
      for ( var index = this.cells.length - 1; index > -1; index-- ) {
        if ( this.cells[ index ].isFilledProperty.value ) {
          return this.cells[ index ];
        }
      }
    },

    /**
     * add a number of cells to the container
     * @param {number} numberOfCells
     * @public
     */
    addCells: function( numberOfCells ) {

      // add Cells to the container
      for ( var i = 0; i < numberOfCells; i++ ) {
        this.cells.push( new Cell() );
      }
    },

    /**
     * returns if the container is completely full
     * @returns {boolean}
     * @public
     */
    isContainerFull: function() {
      return this.cells.every( function( cell ) {
        return cell.isFilledProperty.value;
      } );
    },

    /**
     * check if the container contains an occupied cell
     * @returns {boolean}
     * @public
     */
    isContainerEmpty: function() {
      return this.cells.every( function( cell ) {
        return !cell.isFilledProperty.value;
      } );
    },

    /**
     * count the number of filled cells
     * @returns {number}
     * @public
     */
    getNumberOfFilledCells: function() {
      var filledCellCounter = 0;

      for ( var index = 0; index < this.cells.length; index++ ) {
        if ( this.cells[ index ].isFilledProperty.value ) {
          filledCellCounter += 1;
        }
      }
      return filledCellCounter;
    }

  } );
} );