// Copyright 2017-2018, University of Colorado Boulder

/**
 * Game screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const BuildingGameModel = require( 'FRACTIONS_COMMON/game/model/BuildingGameModel' );
  const BuildingGameScreenView = require( 'FRACTIONS_COMMON/game/view/BuildingGameScreenView' );
  const FractionsCommonColorProfile = require( 'FRACTIONS_COMMON/common/view/FractionsCommonColorProfile' );
  const fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenGameString = require( 'string!FRACTIONS_INTRO/screen.game' );

  class GameScreen extends Screen {
    constructor() {
      super(
        () => new BuildingGameModel( false ),
        model => new BuildingGameScreenView( model ),
        {
          name: screenGameString,
          backgroundColorProperty: FractionsCommonColorProfile.otherScreenBackgroundProperty,
          homeScreenIcon: BuildingGameScreenView.createUnmixedScreenIcon()
        }
      );
    }
  }

  return fractionsIntro.register( 'GameScreen', GameScreen );
} );
