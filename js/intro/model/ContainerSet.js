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

    // present for the lifetime of the simulation
    maxProperty.link( function( max, oldMax ) {
      var difference = max - oldMax;

      if ( difference > 0 ) {

        // add Containers to the set
        for ( var i = 0; i < difference; i++ ) {
          self.containers.push( new Container( denominatorProperty ) );
        }
      }
      else if ( difference < 0 ) {

        // TODO: generalize to many pops
        // remove a Container to this set
        self.containers.pop();
      }

    } );

    // change the value of the denominator
    denominatorProperty.link( function( denominator, oldDenominator ) {
      var delta = denominator - oldDenominator;
      if ( delta > 0 ) {

        // TODO generalize to many add cells
        // add a Cell to every Container
        self.containers.forEach( function( container ) {
          container.addCells( [ denominator - 1 ] );
        } );
      }
      else if ( delta < 0 ) {

        // TODO generalize to remove many cells
        // remove Cells to every Container
        var removedCells = self.containers.map( function( container ) {
          container.cells.pop();
        } );

        // TODO find the removed Cells with IsFilled =true
        console.log( removedCells );
        // self.reshuffleFilledCells( removedFilledCells );
      }
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
              count--;
              cell.isFilledProperty.toggle();
            }
          } );
        } );
      }
      else if ( delta < 0 ) {

        // toggle an appropriate number of Cells to isFilled = false
        self.containers.forEach( function( container ) {
          container.cells.forEach( function( cell ) {
            if ( cell.isFilledProperty.value === true && count < 0 ) {
              count++;
              cell.isFilledProperty.toggle();
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
    }
  } );
} );