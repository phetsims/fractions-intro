// Copyright 2017, University of Colorado Boulder

/**
 * Possible representation Enumeration
 *
 * @author Michael Moorer (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );

  var Representation = {
    CIRCLE: 'circle',
    HORIZONTAL_BAR: 'horizontal-bar',
    VERTICAL_BAR: 'vertical-bar',
    BEAKER: 'beaker',
    CAKE: 'cake',
    NUMBER_LINE: 'number-line'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( Representation ); }

  fractionsIntro.register( 'Representation', Representation );

  return Representation;
} );