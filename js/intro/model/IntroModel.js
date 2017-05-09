// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );

  /**
   * @constructor
   */
  function IntroModel() {
    //TODO
  }

  fractionsIntro.register( 'IntroModel', IntroModel );

  return inherit( Object, IntroModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );