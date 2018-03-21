// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroModel = require( 'FRACTIONS_COMMON/intro/model/IntroModel' );
  var IntroScreenView = require( 'FRACTIONS_COMMON/intro/view/IntroScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: 'Intro',
      backgroundColorProperty: new Property( Color.WHITE )
    };

    Screen.call( this,
      function() { return new IntroModel; },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
