// Copyright 2017, University of Colorado Boulder

/**
 * Type for a cell, a part of a container
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function Cell() {

    // @private {Property.<Vector2>}
    this.positionProperty = new Property( Vector2.ZERO );

    // @private {Property.<boolean>}
    this.isDraggedProperty = new BooleanProperty( false );

    // @private {Property.<boolean>}
    this.isAnimatedProperty = new BooleanProperty( false );

    // @public {Property.<number>}
    this.indexProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>}
    this.isFilledProperty = new BooleanProperty( false );

    // @public {Property.<number>}
    this.rotationAngleProperty = new NumberProperty( 0 );
  }

  fractionsIntro.register( 'Cell', Cell );

  return inherit( Object, Cell, {

    /**
     * Finds the distance between the cell and another vector
     * @param {Vector2} toVector - the vector to find this cells distance from
     * @returns {number}
     * @public
     */
    distanceTo: function( toVector ) {
      return this.positionProperty.distance( toVector );
    },

    /**
     * Resets all the properties of the Cell
     * @public
     */
    reset: function() {
      this.isDraggedProperty.reset();
      this.isAnimatedProperty.reset();
      this.indexProperty.reset();
      this.isFilledProperty.reset();
      this.positionProperty.reset();
    }
  } );
} );