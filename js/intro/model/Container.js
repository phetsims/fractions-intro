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

    // @private
    this.denominatorProperty = denominatorProperty;

    // @public
    this.cells = [];

    this.addCells( denominatorProperty.value );

  }

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container, {

    /**
     *
     * @param {number} cellIndex
     * @returns {Cell}
     */
    getCellWithIndex: function( cellIndex ) {
      var cellWithIndex = this.cells.filter( function( cell ) {
        return (cell.indexProperty.value === cellIndex);
      } );
      assert && assert( cellWithIndex.length <= 1 );
      return cellWithIndex[ 0 ];
    },

    /**
     * @param {number} index
     * @returns {boolean}
     * @public
     */
    isCellWithIndexEmpty: function( index ) {
      var cell = this.getCellWithIndex( index );
      return cell.isFilledProperty.value === false;
    },

    /**
     * @param {number} numberOfCells
     */
    addCells: function( numberOfCells ) {
      // add Cells to the container
      for ( var i = 0; i < numberOfCells; i++ ) {
        this.cells.push( new Cell() );
      }
    },

    /**
     * @param {number} cellIndex
     * @public
     */
    removeCellWithIndex: function( cellIndex ) {
      assert && assert( !this.isCellWithIndexEmpty( cellIndex ) );

      // do not assume the cells are sorted
      var cell = this.getCellWithIndex( cellIndex );
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.cells[ i ] === cell ) {
          this.cells.splice( i, 1 );
          break;
        }
      }
    }

  } );
} );