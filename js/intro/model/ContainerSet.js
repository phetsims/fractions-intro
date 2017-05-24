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

    // @private
    this.denominatorProperty = denominatorProperty;

    // present for the lifetime of the simulation
    maxProperty.link( function( max, oldMax ) {
      var difference = max - oldMax;

      if ( difference > 0 ) {

        // add 'difference' number of containers
        self.addContainers( difference );
      }
      else if ( difference < 0 ) {

        // removed '-difference' containers starting from the end of the array.
        var removedContainers = self.containers.splice( max - 1, -difference );

        var removedCells = self.flattenContainers( removedContainers );

        var removedFilledCellsCount = self.getFilledCellsCount( removedCells );

        self.toggleIsFilledTo( removedFilledCellsCount, false );

      }
      console.table( self.containers );
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

        var removeCellsCount = self.getFilledCellsCount( removedCells );

        self.toggleIsFilledTo( removeCellsCount, false );
        //        self.reshuffleFilledCells( removedFilledCells );
      }
      console.table( self.containers );
    } );

    // updates the isFilledProperty of cells upon the change of the numerator
    numeratorProperty.link( function( numerator, oldNumerator ) {
      var difference = numerator - oldNumerator;

      // prevents update of isFillerProperty if numerator value and max value decrease at the same time.
      if ( oldNumerator / denominatorProperty.value < maxProperty.value ) {

        // numerator is increasing
        if ( difference > 0 ) {

          // toggle isFilled of 'difference' number of cells from false to true
          self.toggleIsFilledTo( difference, false );
        }

        // numerator is decreasing
        else if ( difference < 0 ) {


          // toggle isFilled of '-difference' (a positive number) of cells from true to false
          self.toggleIsFilledTo( -difference, true );
        }
      }
      console.log( self.getFilledCellsCount( self.flattenContainers( self.containers ) ) );
    } );
  }

  fractionsIntro.register( 'ContainerSet', ContainerSet );

  return inherit( Object, ContainerSet, {

    /**
     * Reshuffles the purge filled cells to remaining containers
     * @param {Cell[]} removedFilledCells
     * @private
     */
    reshuffleFilledCells: function( removedFilledCells ) {
      var count = removedFilledCells.length;

      // toggle isFilled of 'count' number of cells from false to true
      this.toggleIsFilledTo( count, false );
    },

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
     * @param {number} numberOfCells
     * @param {boolean} isFilled
     * @private
     */
    toggleIsFilledTo: function( numberOfCells, isFilled ) {

      this.containers.forEach( function( container ) {
        container.cells.forEach( function( cell ) {
          if ( numberOfCells > 0 && cell.isFilledProperty.value === isFilled ) {
            cell.isFilledProperty.toggle();
            numberOfCells--;
          }
        } );
      } );
    },

    /**
     * get Filled Cells
     * @param {Cell[]} cells
     */
    getFilledCells: function( cells ) {
      return cells.filter( function( cell ) { return cell.isFilledProperty.value; } );
    },

    /**
     * get Filled Cells Count
     * @param {Cell[]} cells
     * @returns {number}
     */
    getFilledCellsCount: function( cells ) {
      return this.getFilledCells( cells ).length;
    },

    /**
     * Flatten an array of containers to an array of cells
     * @param {Container[]} containers
     * @returns {Cell[]}
     */
    flattenContainers: function( containers ) {
      return containers.reduce( function( accumulator, container ) {
        return accumulator.concat( container.cells );
      }, [] );

    }

  } );
} );