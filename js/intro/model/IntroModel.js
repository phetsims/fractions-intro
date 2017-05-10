// Copyright 2017, University of Colorado Boulder

/**
 * @author Dusty Cole(Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var NumberProperty = require( 'AXON/NumberProperty' );


  /**
   * @constructor
   */
  function IntroModel() {
    // @public {Property.<number>}
    this.denominatorProperty = new NumberProperty( 2 );

    // @public {Property.<number>}
    this.numeratorProperty = new NumberProperty( 1 );

    // @public {Property.<number>}
    this.fractionProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        return numerator / denominator;
      } );
  }

  fractionsIntro.register( 'IntroModel', IntroModel );

  return inherit( Object, IntroModel, {
    /**
     * Reset
     * @public
     */
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    }


  } );
} );