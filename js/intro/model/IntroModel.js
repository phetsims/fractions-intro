// Copyright 2017, University of Colorado Boulder

/**
 * Main model of the simulation, which tracks the numerator, denominator and maximum value as axon properties.
 *
 * @author Dusty Cole (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function IntroModel() {

    var self = this;

    // @public (read-only) {Property.<number>}
    this.denominatorProperty = new NumberProperty( IntroConstants.DENOMINATOR_RANGE.defaultValue );

    // @public (read-only) {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public (read-only) {Property.<number>}
    this.fractionProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        return numerator / denominator;
      } );

    // @public (read-only) {Property.<number>}
    this.maxNumberOfUnitsProperty = new NumberProperty( IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.defaultValue );

    //link numeratorProperty to denominatorProperty and to maxNumberOfUnits
    Property.multilink( [ this.denominatorProperty, this.numeratorProperty, this.maxNumberOfUnitsProperty ], function( denominator, numerator, maxNumberOfUnits ) {
      if ( numerator / denominator > maxNumberOfUnits ) {

        //decreases numeratorProperty as dependent on the maxNumberofUnits and denominator
        self.numeratorProperty.value = denominator * maxNumberOfUnits;
      }
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
      this.maxNumberOfUnitsProperty.reset();
    }
  } );
} );