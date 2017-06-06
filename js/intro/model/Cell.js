// Copyright 2017, University of Colorado Boulder

/**
 * Type for a cell, a part of a container
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
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

    // @private {Property.<Vector2>}
    this.positionProperty = new Property( Vector2.ZERO );

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
    },

    /**
     * Finds the distance between this cell and another vector
     * @param {Vector2} toVector - the vector to find this cells distance from
     * @returns {number}
     * @public
     */
    distanceTo: function( toVector ) {
      return this.positionProperty.value.distance( toVector );
    },

    /**
     * Toggle the value of isFilled
     * @public
     */
    toggleIsFilled: function() {
      return this.isFilledProperty.toggle();
    },

    /**
     * Returns the fill status of this cell
     * @returns {boolean}
     * @public
     */
    isFilled: function() {
      return this.isFilledProperty.value;
    },

    /**
     * Returns true is the cell is empty
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