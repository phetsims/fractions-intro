// Copyright 2017-2018, University of Colorado Boulder

/**
 * Intro screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import FractionsCommonColorProfile from '../../../fractions-common/js/common/view/FractionsCommonColorProfile.js';
import IntroModel from '../../../fractions-common/js/intro/model/IntroModel.js';
import IntroScreenView from '../../../fractions-common/js/intro/view/IntroScreenView.js';
import Screen from '../../../joist/js/Screen.js';
import fractionsIntroStrings from '../fractions-intro-strings.js';
import fractionsIntro from '../fractionsIntro.js';

const screenIntroString = fractionsIntroStrings.screen.intro;

class IntroScreen extends Screen {
  constructor() {
    super(
      () => new IntroModel( false ),
      model => new IntroScreenView( model ),
      {
        name: screenIntroString,
        backgroundColorProperty: FractionsCommonColorProfile.introScreenBackgroundProperty,
        homeScreenIcon: IntroScreenView.createUnmixedScreenIcon(),
        navigationBarIcon: IntroScreenView.createUnmixedScreenThumbnail()
      }
    );
  }
}

fractionsIntro.register( 'IntroScreen', IntroScreen );
export default IntroScreen;