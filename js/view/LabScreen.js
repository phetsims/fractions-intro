// Copyright 2017-2018, University of Colorado Boulder

/**
 * Lab screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const BuildingLabModel = require( 'FRACTIONS_COMMON/lab/model/BuildingLabModel' );
  const BuildingLabScreenView = require( 'FRACTIONS_COMMON/lab/view/BuildingLabScreenView' );
  const FractionsCommonColorProfile = require( 'FRACTIONS_COMMON/common/view/FractionsCommonColorProfile' );
  const fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!FRACTIONS_INTRO/screen.lab' );

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

  return fractionsIntro.register( 'LabScreen', LabScreen );
} );
