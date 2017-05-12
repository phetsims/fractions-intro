// Copyright 2017, University of Colorado Boulder

/**
 * Main screen view of the simulation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );

  /**
   * @param {IntroModel} introModel
   * @constructor
   */
  function IntroScreenView( introModel ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        introModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );

    // create and add number line Node
    var numberLineNode = new NumberLineNode( introModel.maxNumberOfUnitsProperty, introModel.denominatorProperty, {
      x: 100,
      bottom: this.layoutBounds.maxY - 10
    } );

    // create and add number spinner for number of units
    var numberOfUnitsSpinner = new NumberSpinner( introModel.maxNumberOfUnitsProperty, IntroConstants.MAX_NUMBER_OF_UNITS_RANGE, {
      x: 500,
      y: 10
    } );

    // fraction node
    var fractionNode = new FractionNode( introModel.numeratorProperty, introModel.denominatorProperty, introModel.maxNumberOfUnitsProperty, {
      x: 100,
      y: 200
    } );

    var options = {
      children: [ resetAllButton, numberLineNode, numberOfUnitsSpinner, fractionNode ]
    };
    ScreenView.call( this, options );
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView );
} );