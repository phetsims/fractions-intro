// Copyright 2017, University of Colorado Boulder

/**
 * Possible representation states
 *
 * @author Michael Moorer (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );

  var RepresentationState = {
    CIRCLE: 'circle',
    HORIZONTAL_BAR: 'horizontal-bar',
    VERTICAL_BAR: 'vertical-bar',
    BEAKER: 'beaker',
    CAKE: 'cake',
    NUMBER_LINE: 'number-line'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( RepresentationState ); }

  fractionsIntro.register( 'RepresentationState', RepresentationState );

  return RepresentationState;
} );