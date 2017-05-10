// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
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

    // Numberline Node
    var numberLineNode = new NumberLineNode();
    this.addChild( numberLineNode );
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView );
} );