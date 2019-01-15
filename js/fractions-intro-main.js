// Copyright 2017-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GameScreen = require( 'FRACTIONS_INTRO/view/GameScreen' );
  const IntroScreen = require( 'FRACTIONS_INTRO/view/IntroScreen' );
  const LabScreen = require( 'FRACTIONS_INTRO/view/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const fractionsIntroTitleString = require( 'string!FRACTIONS_INTRO/fractions-intro.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Ariel Paul',
      softwareDevelopment: 'Jonathan Olson, Sam Reid, Martin Veillette',
      team: 'Mike Dubson, Trish Loeblein, Amanda McGarry, Kathy Perkins',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( () => {
    const sim = new Sim( fractionsIntroTitleString, [
      new IntroScreen(),
      new GameScreen(),
      new LabScreen()
    ], simOptions );
    sim.start();
  } );
} );