// Copyright 2017, University of Colorado Boulder

/**
 * Type for container set, a set of Containers.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Container = require( 'FRACTIONS_INTRO/intro/model/Container' );
  var Emitter = require( 'AXON/Emitter' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty
   * @constructor
   */
  function ContainerSet( numeratorProperty, denominatorProperty, maxProperty ) {

    var self = this;

    // @public
    this.containers = [];

    // @public (read only)
    this.denominatorProperty = denominatorProperty;

    // @public
    this.numeratorProperty = numeratorProperty;

    // @private
    this.containersEmitter = new Emitter();

    // @private
    // an account of the previous amount of filled cells
    this.oldCellCount = this.numeratorProperty.value;

    // present for the lifetime of the simulation
    maxProperty.link( function( max, oldMax ) {
      var difference = max - oldMax;

      if ( difference > 0 ) {

        // add 'difference' number of containers
        self.addContainers( difference );
      }
      else if ( difference < 0 ) {

        // removed '-difference' containers starting from the end of the array.
        var removedContainers = self.containers.splice( max, -difference );

        var removedCells = self.flattenContainers( removedContainers );

        var removedFilledCells = removedCells.filter( function( cell ) {
          return cell.isFilledProperty.value;
        } );

        self.toggleIsFilledTo( removedFilledCells.length, false );

      }
      self.containersEmitter.emit();
    } );

    // change the value of the denominator
    denominatorProperty.lazyLink( function( denominator, oldDenominator ) {
      var difference = denominator - oldDenominator;
      if ( difference > 0 ) {

        // add cells to every Container
        self.containers.forEach( function( container ) {
          container.addCells( difference );
        } );
      }
      else if ( difference < 0 ) {

        // remove top cells for each container
        var removedCells = self.containers.reduce( function( accumulator, container ) {
          return accumulator.concat( container.cells.splice( denominator - 1, -difference ) );
        }, [] );

        var removedFilledCells = removedCells.filter( function( cell ) {
          return cell.isFilledProperty.value;
        } );

        self.toggleIsFilledTo( removedFilledCells.length, false );
      }
      self.containersEmitter.emit();
    } );

    // updates the isFilledProperty of cells upon the change of the numerator
    numeratorProperty.link( function( numerator, oldNumerator ) {
      var difference = numerator - oldNumerator;

      // the difference between filled cell count now and before numerator was changed
      // should be zero unless emptyThisCell method is used
      var cellCountDifference = self.getFilledCellsCount() - self.oldCellCount;

      // if these two values are equal, then emptyThisCell method has been used and we can skip toggleIsFilledTo
      if ( difference !== cellCountDifference ) {
        // numerator is increasing
        if ( difference > 0 ) {

          // toggle isFilled of 'difference' number of cells from false to true
          self.toggleIsFilledTo( difference, false );
        }

        // numerator is decreasing
        else if ( difference < 0 ) {

          // prevents update of isFillerProperty if numerator value and max value decrease at the same time.
          if ( oldNumerator / denominatorProperty.value <= maxProperty.value ) {

            // toggle isFilled of '-difference' (a positive number) of cells from true to false
            self.toggleIsFilledTo( -difference, true );
          }
        }
      }
      self.containersEmitter.emit();
      self.oldCellCount = self.numeratorProperty.value;
    } );
  }

  fractionsIntro.register( 'ContainerSet', ContainerSet );

  return inherit( Object, ContainerSet, {

    /**
     * Add 'numberOfContainers' to ContainerSet
     * @param {number} numberOfContainers
     * @private
     */
    addContainers: function( numberOfContainers ) {

      // add Containers to the set
      for ( var i = 0; i < numberOfContainers; i++ ) {
        this.containers.push( new Container( this.denominatorProperty ) );
      }
    },

    /**
     * Toggle the cell value of isFilledProperty to isFilled for 'numberOfCells' cells in ContainerSet
     * @param {number} numberOfCellsToToggle
     * @param {boolean} toggleTo
     * @private
     */
    toggleIsFilledTo: function( numberOfCellsToToggle, toggleTo ) {

      if ( toggleTo ) {
        var availableFilledCells = this.getFilledCellsCount();

        // if there are more cells to BE emptied than there are cells to empty, only empty as many cells as possible
        var numberOfCellsToEmpty = availableFilledCells >= numberOfCellsToToggle ? numberOfCellsToToggle : availableFilledCells;
        for ( var i = 0; i < numberOfCellsToEmpty; i++ ) {
          this.getLastNonEmptyContainer().getNextFilledCell().toggleIsFilled();
        }
      }
      else {
        var availableEmptyCells = this.getEmptyCellsCount();

        // if there are more cells to BE filled than there are cells to fill, only fill as many cells as possible
        var numberOfCellsToFill = availableEmptyCells >= numberOfCellsToToggle ? numberOfCellsToToggle : availableEmptyCells;
        for ( var j = 0; j < numberOfCellsToFill; j++ ) {
          this.getNextNonFullContainer().getNextEmptyCell().toggleIsFilled();
        }
      }
    },

    /**
     * get last container that has at least one filled cell
     * @returns {Container}
     * @private
     */
    getLastNonEmptyContainer: function() {
      return this.containers.reduce( function( previous, current ) {

          // if current container is empty, we want the previous container
          return current.isContainerEmpty() ? previous : current;
        }
      );
    },

    /**
     * get the next container that has at least one empty cell
     * @returns {Container}
     * @private
     */
    getNextNonFullContainer: function() {
      for ( var index = 0; index < this.containers.length; index++ ) {
        if ( !this.containers[ index ].isContainerFull() ) {
          return this.containers[ index ];
        }
      }
    },

    /**
     * get Filled Cells in this container set
     * @returns {Cell[]}
     * @private
     */
    getFilledCells: function() {
      var cells = this.getAllCells();
      return cells.filter( function( cell ) {
        return cell.isFilled();
      } );
    },

    /**
     * get Filled Cells Count in this container set
     * @returns {number}
     */
    getFilledCellsCount: function() {
      return this.getFilledCells().length;
    },

    /**
     * get all the empty cells in this container set
     * does not include cell that are currently empty and will be filled by a piece.
     * @returns {Cell[]}
     * @private
     */
    getEmptyCells: function() {
      var cells = this.getAllCells();
      return cells.filter( function( cell ) {
        return cell.isEmpty();
      } );
    },

    /**
     * find number of empty cells in this container set
     * @return {number}
     * @public
     */
    getEmptyCellsCount: function() {
      return this.getEmptyCells().length;
    },

    /**
     * finds closest empty cell of an array of containers to position
     * @param {Vector2} position - the vector to find the closest cell to
     * @returns {Cell}
     * @private
     */
    getClosestEmptyCell: function( position ) {

      var closestCell = this.getEmptyCells().reduce( function( previousCell, currentCell ) {
        return (previousCell.distanceTo( position ) <
                currentCell.distanceTo( position )) ? previousCell : currentCell;
      } );
      return closestCell;
    },

    /**
     * Flatten an array of containers to an array of cells
     * @param {Container[]} containers
     * @returns {Cell[]}
     * @public
     */
    flattenContainers: function( containers ) {
      return containers.reduce( function( accumulator, container ) {
        return accumulator.concat( container.cells );
      }, [] );
    },

    /**
     * get all the cells in the container
     * @returns {Cell[]}
     * @public
     */
    getAllCells: function() {
      return this.flattenContainers( this.containers );
    },

    /**
     * empties a given cell and updates numerator property and oldCellCount
     * @param {Cell} cell
     * @public
     */
    emptyThisCell: function( cell ) {

      // must be done in this order or the emptied cell will be double counted!!
      this.oldCellCount = this.getFilledCellsCount();

      // update the fill property of this cell to empty
      cell.isFilledProperty.value = false;

      this.numeratorProperty.value = this.numeratorProperty.value - 1;
      this.containersEmitter.emit();
    },

    /**
     * fill a given cell and updates numerator property and oldCellCount
     * @param {Cell} cell
     * @public
     */
    fillThisCell: function( cell ) {

      this.oldCellCount = this.getFilledCellsCount();

      // update the fill property of this cell to fill
      cell.isFilledProperty.value = true;

      this.numeratorProperty.value = this.numeratorProperty.value + 1;
      this.containersEmitter.emit();
    }
  } );
} );