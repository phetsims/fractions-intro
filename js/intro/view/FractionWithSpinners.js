// Copyright 2017, University of Colorado Boulder

/**
 * Scenery node for the visual representation of a fraction with up/down spinners for numerator/denominator
 *
 * @author Michael Moorer (Berea College)
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RoundSpinner = require( 'FRACTIONS_INTRO/intro/view/RoundSpinner' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @extends {HBox}
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionWithSpinners( numeratorProperty, denominatorProperty, maxProperty, options ) {

    options = _.extend( {
      fill: 'black',
      font: new PhetFont( 110 ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    // convenience variable
    var modelProperties = [ numeratorProperty, denominatorProperty, maxProperty ];

    // create properties to enable/disable spinners.
    var canIncreaseNumeratorProperty = new DerivedProperty( modelProperties,
      function( numerator, denominator, max ) {
        return ( numerator + 1 ) / denominator <= max;
      } );
    var canDecreaseNumeratorProperty = new DerivedProperty( modelProperties,
      function( numerator ) {
        return ( numerator - 1 ) >= 0;
      } );
    var canIncreaseDenominatorProperty = new DerivedProperty( modelProperties,
      function( numerator, denominator) {
        return ( denominator + 1 ) <= IntroConstants.DENOMINATOR_RANGE.max;
      } );
    var canDecreaseDenominatorProperty = new DerivedProperty( modelProperties,
      function( numerator, denominator, max ) {
        return ( denominator - 1 ) >= IntroConstants.DENOMINATOR_RANGE.min &&
               numerator / ( denominator - 1 ) <= max;
      } );

    var numeratorUpButtonListener = function() {numeratorProperty.value++;};
    var numeratorDownButtonListener = function() {numeratorProperty.value--;};
    var denominatorUpButtonListener = function() {denominatorProperty.value++;};
    var denominatorDownButtonListener = function() {denominatorProperty.value--;};

    // create numerator spinner
    var numeratorSpinner = new RoundSpinner(
      numeratorUpButtonListener,
      numeratorDownButtonListener,
      canIncreaseNumeratorProperty,
      canDecreaseNumeratorProperty );

    // create denominator spinner
    var denominatorSpinner = new RoundSpinner(
      denominatorUpButtonListener,
      denominatorDownButtonListener,
      canIncreaseDenominatorProperty,
      canDecreaseDenominatorProperty );

    // create the visual representation of a fraction
    var fractionNode = new FractionNode( numeratorProperty, denominatorProperty, options );

    // specify the children to be rendered with this node
    HBox.call( this, _.extend( options, {
      children: [
        new VBox( {
          spacing: 50,
          children: [ numeratorSpinner, denominatorSpinner ]
        } ),
        fractionNode ]
    } ) );
  }

  fractionsIntro.register( 'FractionWithSpinners', FractionWithSpinners );

  return inherit( HBox, FractionWithSpinners );
} );