// Copyright 2017, University of Colorado Boulder

/**
 * Represents a filled cell (of 1/N, for whatever denominator).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {ProtoContainer} container
   * @param {number} index
   */
  function ProtoCell( container, index ) {
    // @public {ProtoContainer} - Sometimes this is easier to access when stored on the cell
    this.container = container;

    // @public {number} - Which cell is it? (Can determine rotation/location from this)
    this.index = index;

    // @public {Property.<boolean>} - Whether it is "logically" filled. Includes cells that have pieces animation to them.
    this.isFilledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} - Whether it is "visually" filled. Means isFilled and no piece animating to it.
    this.appearsFilledProperty = new BooleanProperty( false );

    // @private {Property.<ProtoPiece|null>} - The piece that is on its way to us.
    this.targetedPieceProperty = new Property( null );
  }

  fractionsIntro.register( 'ProtoCell', ProtoCell );

  return inherit( Object, ProtoCell, {
    /**
     * Fills a totally empty cell (no piece incoming).
     * @public
     */
    fill: function() {
      assert && assert( !this.isFilledProperty.value && !this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      this.isFilledProperty.value = true;
      this.appearsFilledProperty.value = true;
    },

    /**
     * Empies a totally full cell (no piece incoming).
     * @public
     */
    empty: function() {
      assert && assert( this.isFilledProperty.value && this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      this.isFilledProperty.value = false;
      this.appearsFilledProperty.value = false;
    },

    /**
     * "Fills" the cell by noting that this piece will now be animating to us.
     * @public
     */
    targetWithPiece: function( piece ) {
      assert && assert( !this.isFilledProperty.value && !this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = this;
      this.targetedPieceProperty.value = piece;

      this.isFilledProperty.value = true;
    },

    /**
     * "Unfills" the cell by noting that this piece will not be animating to us anymore.
     * @public
     */
    untargetFromPiece: function( piece ) {
      assert && assert( this.isFilledProperty.value && !this.appearsFilledProperty.value && this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = null;
      this.targetedPieceProperty.value = null;

      this.isFilledProperty.value = false;
    },

    /**
     * The piece that was animating to us finally "hit" us and filled us visually.
     * @public
     */
    fillWithPiece: function( piece ) {
      assert && assert( this.isFilledProperty.value && !this.appearsFilledProperty.value && this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = null;
      this.targetedPieceProperty.value = null;

      this.appearsFilledProperty.value = true;
    }
  } );
} );
