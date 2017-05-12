// Copyright 2014-2015, University of Colorado Boulder

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
    NUMBER_LINE_WIDTH: 800, // Width used for number line.
    MAX_NUMBER_OF_UNITS_RANGE: new RangeWithValue( 1, 6, 1 ),
    MAJOR_TICK_LENGTH: 100, //length of major tick line
    MINOR_TICK_LENGTH: 50, //length of minor tick line
    DENOMINATOR_RANGE: new RangeWithValue( 1, 8, 1 ),
    NUMBER_LINE_FONT: new PhetFont( 50 )
  } );
} );