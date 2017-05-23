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

    this.denominatorProperty = denominatorProperty;

    // present for the lifetime of the simulation
    maxProperty.link( function( max, oldMax ) {
      var difference = max - oldMax;

      if ( difference > 0 ) {
        self.addContainers( difference );
      }
      else if ( difference < 0 ) {
        var removedContainers = self.containers.splice( max - 1, -difference );
      }
      console.table( removedContainers );
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

      var delta = numerator - oldNumerator;
      var count = delta;
      if ( delta > 0 ) {

        // toggle an appropriate number of Cells to isFilled = true
        self.containers.forEach( function( container ) {
          container.cells.forEach( function( cell ) {
            if ( cell.isFilledProperty.value === false && count > 0 ) {
              cell.isFilledProperty.toggle();
              count--;
            }
          } );
        } );
      }
      else if ( delta < 0 ) {

        // toggle an appropriate number of Cells to isFilled = false
        self.containers.forEach( function( container ) {
          container.cells.forEach( function( cell ) {
            if ( cell.isFilledProperty.value === true && count < 0 ) {
              cell.isFilledProperty.toggle();
              count++;
            }
          } );
        } );
      }
    } );
  }

  fractionsIntro.register( 'ContainerSet', ContainerSet );

  return inherit( Object, ContainerSet, {

    /**
     * reshuffles the purge filled cells to remaining containers
     * @param {Cell[]} removedFilledCells
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
     * @param {number} numberOfContainers
     */
    addContainers: function( numberOfContainers ) {
      // add Containers to the set
      for ( var i = 0; i < numberOfContainers; i++ ) {
        this.containers.push( new Container( this.denominatorProperty ) );
      }
    }
  } );
} );