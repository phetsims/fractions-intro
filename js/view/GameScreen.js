// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BuildingGameModel = require( 'FRACTIONS_COMMON/game/model/BuildingGameModel' );
  var BuildingGameScreenView = require( 'FRACTIONS_COMMON/game/view/BuildingGameScreenView' );
  var Color = require( 'SCENERY/util/Color' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenGameString = require( 'string!FRACTIONS_INTRO/screen.game' );

  /**
   * @constructor
   */
  function GameScreen() {

    var options = {
      name: screenGameString,
      backgroundColorProperty: new Property( Color.WHITE )
    };

    Screen.call( this,
      function() { return new BuildingGameModel(); },
      function( model ) { return new BuildingGameScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'GameScreen', GameScreen );

  return inherit( Screen, GameScreen );
} );
