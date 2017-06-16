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

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} index
   */
  function Cell( index ) {
    // @public {number}
    this.index = index;

    // @public {Property.<boolean>}
    this.isFilledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.appearsFilledProperty = new BooleanProperty( false );
  }

  fractionsIntro.register( 'Cell', Cell );

  return inherit( Object, Cell );
} );
