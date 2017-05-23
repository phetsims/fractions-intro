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
        self.addContainers( difference );
      }
      else if ( difference < 0 ) {
        var removedContainers = self.containers.splice( max - 1, -difference );
        console.table( removedContainers );
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

        // remove top cells for each containers
        var removedCells = self.containers.reduce( function( accumulator, container ) {
          return accumulator.concat( container.cells.splice( denominator - 1, -difference ) );
        }, [] );

        var removedFilledCells = removedCells.filter( function( cell ) {
          return (cell.isFilledProperty.value === true);
        } );
        // self.reshuffleFilledCells( removedFilledCells );
        console.table( removedFilledCells );
      }
      console.table( self.containers );
    } );

    // change the value of the numerator
    numeratorProperty.link( function( numerator, oldNumerator ) {
      var difference = numerator - oldNumerator;

      // numerator is increasing
      if ( difference > 0 ) {

        // toggle isFilled of 'difference' number of cells to false
        self.toggleIsFilledTo( difference, false );
      }

      // numerator is decreasing
      else if ( difference < 0 ) {

        // toggle isFilled of '-difference' (a positive number) of cells to true
        self.toggleIsFilledTo( -difference, true );
      }
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

      this.containers.forEach( function( container ) {
        container.forEach( function( cell ) {
          if ( cell.isFilledProperty.value === false && count > 0 ) {
            count--;
            cell.isFilledProperty.toggle();
          }
        } );
      } );
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
    }
  } );
} );