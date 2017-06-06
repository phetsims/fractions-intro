// Copyright 2017, University of Colorado Boulder

/**
 * Type for a cell, a part of a container
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function Cell() {

    // @public {Property.<Vector2>}
    this.positionProperty = new Property( Vector2.ZERO );

    // @public {Property.<Bound2>}
    this.boundsProperty = new Property( Bounds2.NOTHING );

    // @public {Property.<boolean>}
    this.isFilledProperty = new BooleanProperty( false );

    // @public {Property.<number>}
    this.rotationAngleProperty = new NumberProperty( 0 );

    // @public {Property.<Piece|null>}
    this.incomingPieceProperty = new Property( null );
  }

  fractionsIntro.register( 'Cell', Cell );

  return inherit( Object, Cell, {

    /**
     * Resets all the properties of this cell
     * @public
     */
    reset: function() {
      this.isDraggedProperty.reset();
      this.isFilledProperty.reset();
      this.positionProperty.reset();
      this.incomingPieceProperty.reset();
      this.boundsProperty.reset();
    },

    /**
     * Finds the distance between this cell and another vector
     * @param {Vector2} position - the vector to find this cells distance from
     * @returns {number}
     * @public
     */
    distanceTo: function( position ) {
      return this.positionProperty.value.distance( position );
    },

    /**
     * Toggle the value of isFilled
     * @public
     */
    toggleIsFilled: function() {
      return this.isFilledProperty.toggle();
    },

    /**
     * Returns true is the cell is currently filled
     * Does not account for the existence of an incoming piece
     * @returns {boolean}
     * @public
     */
    isCurrentlyFilled: function() {
      return this.isFilledProperty.value;
    },

    /**
     * Returns true is the cell is filled or will soon be filled
     * (because an incomingPiece is animated towards it)
     * @returns {boolean}
     * @public
     */
    isFilled: function() {
      return this.isFilledProperty.value || (this.incomingPieceProperty.value !== null);
    },

    /**
     * Returns true is the cell is empty and no incomingPiece if flying toward it
     * @returns {boolean}
     * @public
     */
    isEmpty: function() {
      return !this.isFilled();
    },

    /**
     * Returns the position of this cell
     * @returns {Vector2}
     * @public
     */
    getPosition: function() {
      return this.positionProperty.value;
    }

  } );
} );