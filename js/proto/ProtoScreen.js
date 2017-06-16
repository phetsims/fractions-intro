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
  var Property = require( 'AXON/Property' );
  var ProtoModel = require( 'FRACTIONS_INTRO/proto/model/ProtoModel' );
  var ProtoScreenView = require( 'FRACTIONS_INTRO/proto/view/ProtoScreenView' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @constructor
   */
  function ProtoScreen() {

    var options = {
      name: 'Proto',
      backgroundColorProperty: new Property( Color.WHITE )
    };

    Screen.call( this,
      function() { return new ProtoModel; },
      function( model ) { return new ProtoScreenView( model ); },
      options
    );
  }

  fractionsIntro.register( 'ProtoScreen', ProtoScreen );

  return inherit( Screen, ProtoScreen );
} );
