// Copyright 2017-2018, University of Colorado Boulder

/**
 * Intro screen for Fractions: Intro
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const FractionsCommonColorProfile = require( 'FRACTIONS_COMMON/common/view/FractionsCommonColorProfile' );
  const fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  const IntroModel = require( 'FRACTIONS_COMMON/intro/model/IntroModel' );
  const IntroScreenView = require( 'FRACTIONS_COMMON/intro/view/IntroScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIntroString = require( 'string!FRACTIONS_INTRO/screen.intro' );

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

  return fractionsIntro.register( 'IntroScreen', IntroScreen );
} );
