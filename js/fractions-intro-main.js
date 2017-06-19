// Copyright 2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroScreen = require( 'FRACTIONS_INTRO/intro/IntroScreen' );
  var ProtoScreen = require( 'FRACTIONS_INTRO/proto/ProtoScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var fractionsIntroTitleString = require( 'string!FRACTIONS_INTRO/fractions-intro.title' );

  var simOptions = {
    credits: {
      // TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( fractionsIntroTitleString, [
      new IntroScreen(), new ProtoScreen()
    ], simOptions );
    sim.start();
  } );
} );