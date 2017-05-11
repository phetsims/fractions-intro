// Copyright 2017, University of Colorado Boulder

/**
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
    // TODO: pass x and y through new options argument
    var numberLineNode = new NumberLineNode( introModel.numberOfUnitsProperty, introModel.denominatorProperty );
    numberLineNode.x = 100;
    numberLineNode.y = 500;
    this.addChild( numberLineNode );

    // add and create number spinner for number of units
    var numberSpinner = new NumberSpinner( introModel.numberOfUnitsProperty, IntroConstants.NUMBER_OF_UNITS_RANGE );
    this.addChild( numberSpinner );
    // TODO: pass x and y through new options argument
    numberSpinner.x = 500;
    numberSpinner.y = 10;

    // add and create number spinner for denominator value
    var denominatorSpinner = new NumberSpinner( introModel.denominatorProperty, IntroConstants.DENOMINATOR_RANGE );
    this.addChild( denominatorSpinner );
    // TODO: pass x and y through new options argument
    denominatorSpinner.x = 10;
    denominatorSpinner.y = 300;
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView );
} );