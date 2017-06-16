// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   * @extends {Object}
   */
  function ProtoModel() {
    // @public {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<number>}
    this.denominatorProperty = new NumberProperty( 1 );

    // @public {Property.<number>}
    this.maxProperty = new NumberProperty( 1 );
  }

  fractionsIntro.register( 'ProtoModel', ProtoModel );

  return inherit( Object, ProtoModel, {
    /**
     * Resets the entire model.
     * @public
     */
    reset: function() {
      // TODO
    }
  } );
} );
