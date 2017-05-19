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
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );

  /**
   * @constructor
   */
  function IntroModel() {

    var self = this;

    // @public (read-only) {Property.<number>}
    this.denominatorProperty = new NumberProperty( IntroConstants.DENOMINATOR_RANGE.defaultValue );

    // @public (read-only) {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<string>}
    this.representationProperty = new Property( Representation.CIRCLE );

    // @public (read-only) {Property.<number>}
    this.fractionProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        return numerator / denominator;
      } );

    // @public (read-only) {Property.<number>}
    this.maxProperty = new NumberProperty( IntroConstants.MAX_RANGE.defaultValue );

    // link numeratorProperty to denominatorProperty and to maxNumberOfUnits
    Property.multilink( [ this.denominatorProperty, this.numeratorProperty, this.maxProperty ],
      function( denominator, numerator, max ) {

        // If the maximum decreases, the numerator may also need to be decreased to compensate
        if ( numerator / denominator > max ) {

          // decreases numeratorProperty as dependent on the max and denominator
          self.numeratorProperty.value = denominator * max;
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
      this.maxProperty.reset();
      this.representationProperty.reset();
    }
  } );
} );