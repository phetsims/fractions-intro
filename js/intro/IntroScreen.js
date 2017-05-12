// Copyright 2017, University of Colorado Boulder

/**
 * Main screen of the simulation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var IntroModel = require( 'FRACTIONS_INTRO/intro/model/IntroModel' );
  var IntroScreenView = require( 'FRACTIONS_INTRO/intro/view/IntroScreenView' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new IntroModel(); },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );