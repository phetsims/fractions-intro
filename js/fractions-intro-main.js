// Copyright 2017-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import fractionsIntroStrings from './fractionsIntroStrings.js';
import GameScreen from './view/GameScreen.js';
import IntroScreen from './view/IntroScreen.js';
import LabScreen from './view/LabScreen.js';

const fractionsIntroTitleString = fractionsIntroStrings[ 'fractions-intro' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Ariel Paul',
    softwareDevelopment: 'Jonathan Olson, Sam Reid, Martin Veillette',
    team: 'Mike Dubson, Trish Loeblein, Amanda McGarry, Kathy Perkins, Vincent Davis, Michael Moorer, Dusty Cole',
    qualityAssurance: 'Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Katie Woessner, and Kelly Wurtz',
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