// Copyright 2017, University of Colorado Boulder

/**
 * Main screen view of the Intro screen for Fractions Intro, which shows a radio button group of representations
 * at the top, a fraction in the bottom left and the selected representation in the middle of the screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
  var MaxSpinner = require( 'FRACTIONS_INTRO/intro/view/MaxSpinner' );
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

    var maxSpinner = new MaxSpinner( introModel.maxNumberOfUnitsProperty, { x: this.layoutBounds.maxX - 80, y: this.layoutBounds.minY + 80 } );

    // fraction node
    var fractionNode = new FractionNode( introModel.numeratorProperty, introModel.denominatorProperty, introModel.maxNumberOfUnitsProperty, {
      x: 100,
      y: 200
    } );

    var options = {
      children: [ resetAllButton, numberLineNode, fractionNode, maxSpinner ]
    };
    ScreenView.call( this, options );
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView );
} );