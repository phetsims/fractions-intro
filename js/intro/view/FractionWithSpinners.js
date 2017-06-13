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
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RoundSpinner = require( 'FRACTIONS_INTRO/intro/view/RoundSpinner' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionWithSpinners( numeratorProperty, denominatorProperty, maxProperty, upButtonListener, downButtonListener, options ) {

    options = _.extend( {
      fill: 'black',
      font: new PhetFont( { size: 110 } ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    // Enables or Disables Spinners as dependent on numeratorProperty, denominatorProperty, or maxProperty
    var numeratorUpEnabledProperty = new DerivedProperty(
      [ numeratorProperty, denominatorProperty, maxProperty ],
      function( numerator, denominator, max ) { return numerator < denominator * max; } );

    var numeratorDownEnabledProperty = new DerivedProperty(
      [ numeratorProperty ],
      function( numerator ) { return numerator > 0; } );
    var denominatorUpEnabledProperty = new DerivedProperty(
      [ denominatorProperty ],
      function( denominator ) { return denominator < IntroConstants.DENOMINATOR_RANGE.max; } );
    var denominatorDownEnabledProperty = new DerivedProperty(
      [ numeratorProperty, denominatorProperty, maxProperty ],
      function( numerator, denominator, max ) { return denominator > IntroConstants.DENOMINATOR_RANGE.min && numerator <= (denominator - 1) * max;} );
    // creates spinner that is linked to the numeratorProperty
    var numeratorSpinner = new RoundSpinner( numeratorProperty, numeratorUpEnabledProperty, numeratorDownEnabledProperty,
      { fireOnHold: true, upButtonListener: upButtonListener, downButtonListener: downButtonListener } );

    // creates spinner that is linked to the denominatorProperty
    var denominatorSpinner = new RoundSpinner( denominatorProperty, denominatorUpEnabledProperty, denominatorDownEnabledProperty,
      { fireOnHold: true } );

    var fractionNode = new FractionNode( numeratorProperty, denominatorProperty );

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