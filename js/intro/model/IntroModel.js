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
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @constructor
   */
  function IntroModel() {

    // @public (read-only) {Property.<number>}
    this.denominatorProperty = new NumberProperty( IntroConstants.DENOMINATOR_RANGE.defaultValue );

    // @public (read-only) {Property.<number>}
    this.numeratorProperty = new NumberProperty( 1 );

    // @public (read-only) {Property.<number>}
    this.fractionProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        return numerator / denominator;
      } );

    // @public (read-only) {Property.<number>}
    this.numberOfUnitsProperty = new NumberProperty( IntroConstants.NUMBER_OF_UNITS_RANGE.defaultValue );
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
      this.numberOfUnitsProperty.reset();
    }
  } );
} );