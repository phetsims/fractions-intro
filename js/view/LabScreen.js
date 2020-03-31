// Copyright 2017-2020, University of Colorado Boulder

/**
 * Lab screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import FractionsCommonColorProfile from '../../../fractions-common/js/common/view/FractionsCommonColorProfile.js';
import BuildingLabModel from '../../../fractions-common/js/lab/model/BuildingLabModel.js';
import BuildingLabScreenView from '../../../fractions-common/js/lab/view/BuildingLabScreenView.js';
import Screen from '../../../joist/js/Screen.js';
import fractionsIntroStrings from '../fractionsIntroStrings.js';
import fractionsIntro from '../fractionsIntro.js';

const screenLabString = fractionsIntroStrings.screen.lab;

class LabScreen extends Screen {
  constructor() {
    super(
      () => new BuildingLabModel( false ),
      model => new BuildingLabScreenView( model ),
      {
        name: screenLabString,
        backgroundColorProperty: FractionsCommonColorProfile.otherScreenBackgroundProperty,
        homeScreenIcon: BuildingLabScreenView.createUnmixedScreenIcon()
      }
    );
  }
}

fractionsIntro.register( 'LabScreen', LabScreen );
export default LabScreen;