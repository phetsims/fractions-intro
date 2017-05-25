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

  }

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container, {

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
     * check if the container contains an occupied cell
     * @returns {boolean}
     * @public
     */
    isContainerEmpty: function() {
      return this.cells.every( function( cell ) {
        return !cell.isFilledProperty.value;
      } );
    }

  } );
} );