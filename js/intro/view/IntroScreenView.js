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
    this.addChild( resetAllButton );

    // number line Node
    var numberLineNode = new NumberLineNode( introModel.maxNumberOfUnitsProperty, introModel.denominatorProperty, {
      x: 100,
      y: 500
    } );
    this.addChild( numberLineNode );

    // add and create number spinner for number of units
    var numberOfUnitsSpinner = new NumberSpinner( introModel.maxNumberOfUnitsProperty, IntroConstants.MAX_NUMBER_OF_UNITS_RANGE, {
      x: 500,
      y: 10
    } );
    this.addChild( numberOfUnitsSpinner );

    // add and create number spinner for denominator value
    var denominatorSpinner = new NumberSpinner( introModel.denominatorProperty, IntroConstants.DENOMINATOR_RANGE, {
      x: 10,
      y: 300
    } );
    this.addChild( denominatorSpinner );
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView );
} );