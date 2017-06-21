// Copyright 2017, University of Colorado Boulder

/**
 * Node for the fraction with up/down spinners for numerator/denominator
 *
 * @author Michael Moorer (Berea College)
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/proto/view/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RoundSpinner = require( 'FRACTIONS_INTRO/proto/view/RoundSpinner' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty
   * @param {Function} upButtonListener
   * @param {Function} downButtonListener
   * @param {Object} [options]
   * @constructor
   */
  function FractionWithSpinners( model,
                                 options ) {

    options = _.extend( {
      fill: 'black',
      font: new PhetFont( { size: 110 } ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    var modelProperties = [ model.numeratorProperty, model.denominatorProperty, model.maxProperty ];
    var canIncreaseNumeratorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( numerator + 1 ) / denominator <= max;
    } );
    var canDecreaseNumeratorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( numerator - 1 ) >= 0;
    } );
    var canIncreaseDenominatorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( denominator + 1 ) <= ProtoConstants.DENOMINATOR_RANGE.max;
    } );
    var canDecreaseDenominatorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( denominator - 1 ) >= ProtoConstants.DENOMINATOR_RANGE.min && numerator / ( denominator - 1 ) <= max;
    } );

    var numeratorSpinner = new RoundSpinner( function() {model.numeratorProperty.value++;},
      function() {model.numeratorProperty.value--;}, canIncreaseNumeratorProperty, canDecreaseNumeratorProperty );
    var denominatorSpinner = new RoundSpinner( function() {model.denominatorProperty.value++;},
      function() {model.denominatorProperty.value--;}, canIncreaseDenominatorProperty, canDecreaseDenominatorProperty );

    var fractionNode = new FractionNode( model.numeratorProperty, model.denominatorProperty, options );

    // Specify the children to be rendered with this node
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