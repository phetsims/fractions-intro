// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 *
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  return fractionsIntro.register( 'IntroConstants', {

    // Constants for number line
    NUMBER_LINE_WIDTH: 975, // Width used for number line.
    MAX_RANGE: new RangeWithValue( 1, 6, 1 ),
    MAJOR_TICK_LENGTH: 80, //length of major tick line
    MINOR_TICK_LENGTH: 40, //length of minor tick line
    DENOMINATOR_RANGE: new RangeWithValue( 1, 8, 1 ),
    NUMBER_LINE_FONT: new PhetFont( 40 ),
    BEAKER_WIDTH: 80,
    BEAKER_LENGTH: 150
  } );
} );