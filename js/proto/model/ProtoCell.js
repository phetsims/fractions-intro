// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
   * @param {number} index
   */
  function ProtoCell( index ) {
    // @public {number}
    this.index = index;

    // @public {Property.<boolean>}
    this.isFilledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.appearsFilledProperty = new BooleanProperty( false );

    // @private {Property.<ProtoPiece|null>}
    this.targetedPieceProperty = new Property( null );
  }

  fractionsIntro.register( 'ProtoCell', ProtoCell );

  return inherit( Object, ProtoCell, {
    fill: function() {
      assert && assert( !this.isFilledProperty.value && !this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      this.isFilledProperty.value = true;
      this.appearsFilledProperty.value = true;
    },
    empty: function() {
      assert && assert( this.isFilledProperty.value && this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      this.isFilledProperty.value = false;
      this.appearsFilledProperty.value = false;
    },
    targetWithPiece: function( piece ) {
      assert && assert( !this.isFilledProperty.value && !this.appearsFilledProperty.value && !this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = this;
      this.targetedPieceProperty.value = piece;

      this.isFilledProperty.value = true;
    },
    untargetFromPiece: function( piece ) {
      assert && assert( this.isFilledProperty.value && !this.appearsFilledProperty.value && this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = null;
      this.targetedPieceProperty.value = null;

      this.isFilledProperty.value = false;
    },
    fillWithPiece: function( piece ) {
      assert && assert( this.isFilledProperty.value && !this.appearsFilledProperty.value && this.targetedPieceProperty.value );

      piece.destinationCellProperty.value = null;
      this.targetedPieceProperty.value = null;

      this.appearsFilledProperty.value = true;
    }
  } );
} );
