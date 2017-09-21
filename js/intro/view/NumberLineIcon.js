// Copyright 2017, University of Colorado Boulder

/**
 * The icon for number line use in the representation panel.
 *
 * @author Dusty Cole (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var LINE_LENGTH = 55;
  var TICK_HEIGHT = 20;
  var FONT_SIZE = 10;

  /**
   * @constructor
   */
  function NumberLineIcon() {

    // Draw the lines for the number line symbol for the button icon
    var numberLineShape = new Shape().moveTo( 0, 0 )
      .verticalLineToRelative( TICK_HEIGHT )
      .moveTo( LINE_LENGTH, 0 )
      .verticalLineToRelative( TICK_HEIGHT )
      .moveTo( 0, TICK_HEIGHT / 2 )
      .horizontalLineToRelative( LINE_LENGTH );

    Node.call( this, {
      children: [
        new Path( numberLineShape, { stroke: 'black' } ),
        new Text( '0', { font: new PhetFont( FONT_SIZE ), centerX: 0, top: TICK_HEIGHT } ),
        new Text( '1', { font: new PhetFont( FONT_SIZE ), centerX: LINE_LENGTH, top: TICK_HEIGHT } )
      ]
    } );
  }

  fractionsIntro.register( 'NumberLineIcon', NumberLineIcon );

  return inherit( Node, NumberLineIcon );
} );