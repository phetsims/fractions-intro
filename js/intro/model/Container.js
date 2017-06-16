// Copyright 2017, University of Colorado Boulder

/**
 * Type for a container of cells.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Cell = require( 'FRACTIONS_INTRO/intro/model/Cell' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} denominatorProperty
   * @constructor
   */
  function Container( denominatorProperty ) {

    // @public {Cells[]} an array of cells
    this.cells = [];

    // add initial cells to the container
    this.addCells( denominatorProperty.value );

    // @public {Property.<Bound2>}
    this.boundsProperty = new Property( Bounds2.NOTHING );

    // @private {Property.<Vector2>}
    this.positionProperty = new Property( Vector2.ZERO );

    // @public (Property.<number>)
    this.fractionProperty = new NumberProperty( this.getFraction() );

    // @public (Property.<number>)
    this.denominatorProperty = denominatorProperty;
  }

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container, {

    /**
     * resets this container
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.fractionProperty.reset();
      this.boundsProperty.reset();
      this.cells.forEach( function( cell ) {
        cell.reset();
      } );
    },

    /**
     * finds closest empty cell of this container to position
     * @param {Vector2} position - the vector to find the closest cell to
     * @returns {Cell}
     * @public
     */
    getClosestEmptyCell: function( position ) {

      var closestCell = this.getEmptyCells().reduce( function( previousCell, currentCell ) {
        return (previousCell.distanceTo( position ) <
                currentCell.distanceTo( position )) ? previousCell : currentCell;
      } );
      return closestCell;
    },

    /**
     * get next cell to be filled
     * @returns {Cell}
     * @public
     */
    getNextEmptyCell: function() {
      for ( var index = 0; index < this.cells.length; index++ ) {
        if ( this.cells[ index ].isEmpty() ) {
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
        if ( this.cells[ index ].isFilled() ) {
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
        return cell.isFilled();
      } );
    },

    /**
     * check if the container contains an occupied cell
     * @returns {boolean}
     * @public
     */
    isContainerEmpty: function() {
      return this.cells.every( function( cell ) {
        return cell.isEmpty();
      } );
    },

    /**
     * returns the filled cells in this container
     * @returns {Cell[]}
     * @public
     */
    getFilledCells: function() {
      var filledCells = this.cells.filter( function( cell ) {
        return cell.isFilled();
      } );
      return filledCells;
    },

    /**
     * count the number of filled cells in this container
     * @returns {number}
     * @public
     */
    getFilledCellsCount: function() {
      return this.getFilledCells().length;
    },

    /**
     * returns the empty cells in this container
     * @returns {Cell[]}
     * @public
     */
    getEmptyCells: function() {
      var emptyCells = this.cells.filter( function( cell ) {
        return cell.isEmpty();
      } );
      return emptyCells;
    },

    /**
     * count the number of empty cells in this container
     * @returns {number}
     * @public
     */
    getEmptyCellsCount: function() {
      return this.getEmptyCells().length;
    },

    /**
     * returns the ratio of filled cells to the number of cells in this container
     * @returns {number}
     * @public
     */
    getFraction: function() {
      return this.getFilledCellsCount() / this.cells.length;
    },

    /**
     * returns the number of cells in the container
     * @returns {number}
     * @public
     */
    getCellsCount: function() {
      return this.cells.length;
    }
  } );
} );