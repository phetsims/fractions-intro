// Copyright 2017-2018, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BuildingLabModel = require( 'FRACTIONS_COMMON/lab/model/BuildingLabModel' );
  var BuildingLabScreenView = require( 'FRACTIONS_COMMON/lab/view/BuildingLabScreenView' );
  var FractionsCommonColorProfile = require( 'FRACTIONS_COMMON/common/view/FractionsCommonColorProfile' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!FRACTIONS_INTRO/screen.lab' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: screenLabString,
      backgroundColorProperty: FractionsCommonColorProfile.otherScreenBackgroundProperty
    };

    Screen.call( this,
      function() { return new BuildingLabModel( false ); },
      function( model ) { return new BuildingLabScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
