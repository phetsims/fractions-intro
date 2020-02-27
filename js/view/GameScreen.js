// Copyright 2017-2018, University of Colorado Boulder

/**
 * Game screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import FractionsCommonColorProfile from '../../../fractions-common/js/common/view/FractionsCommonColorProfile.js';
import BuildingGameModel from '../../../fractions-common/js/game/model/BuildingGameModel.js';
import BuildingGameScreenView from '../../../fractions-common/js/game/view/BuildingGameScreenView.js';
import Screen from '../../../joist/js/Screen.js';
import fractionsIntroStrings from '../fractions-intro-strings.js';
import fractionsIntro from '../fractionsIntro.js';

const screenGameString = fractionsIntroStrings.screen.game;

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

fractionsIntro.register( 'GameScreen', GameScreen );
export default GameScreen;