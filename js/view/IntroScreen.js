// Copyright 2017-2021, University of Colorado Boulder

/**
 * Intro screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import fractionsCommonColorProfile from '../../../fractions-common/js/common/view/fractionsCommonColorProfile.js';
import IntroModel from '../../../fractions-common/js/intro/model/IntroModel.js';
import IntroScreenView from '../../../fractions-common/js/intro/view/IntroScreenView.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import fractionsIntro from '../fractionsIntro.js';
import fractionsIntroStrings from '../fractionsIntroStrings.js';

const screenIntroString = fractionsIntroStrings.screen.intro;

class IntroScreen extends Screen {
  constructor() {
    super(
      () => new IntroModel( false ),
      model => new IntroScreenView( model ),
      {
        name: screenIntroString,
        backgroundColorProperty: fractionsCommonColorProfile.introScreenBackgroundProperty,
        homeScreenIcon: new ScreenIcon( IntroScreenView.createUnmixedScreenIcon(), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } ),
        navigationBarIcon: new ScreenIcon( IntroScreenView.createUnmixedScreenThumbnail(), {
          maxIconWidthProportion: 1,
          maxIconHeightProportion: 1
        } )
      }
    );
  }
}

fractionsIntro.register( 'IntroScreen', IntroScreen );
export default IntroScreen;