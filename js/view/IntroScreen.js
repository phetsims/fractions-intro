// Copyright 2017-2018, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var FractionsCommonColorProfile = require( 'FRACTIONS_COMMON/common/view/FractionsCommonColorProfile' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'FRACTIONS_COMMON/intro/model/IntroModel' );
  var IntroScreenView = require( 'FRACTIONS_COMMON/intro/view/IntroScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!FRACTIONS_INTRO/screen.intro' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: screenIntroString,
      backgroundColorProperty: FractionsCommonColorProfile.introScreenBackgroundProperty
    };

    Screen.call( this,
      function() { return new IntroModel( false ); },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
