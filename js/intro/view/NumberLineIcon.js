// Copyright 2013-2017, University of Colorado Boulder

/**
 * The icon for number line.
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
  var LINE_LENGTH = 85;
  var TICK_HEIGHT = 30;
  var FONT_SIZE = 10;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineIcon( options ) {

    Node.call( this );

    var numberLineShape = new Shape();

    // Draw the lines for the number line symbol for the button icon
    numberLineShape.moveTo( 0, 0 )
      .verticalLineToRelative( TICK_HEIGHT )
      .moveTo( LINE_LENGTH, 0 )
      .verticalLineToRelative( TICK_HEIGHT )
      .moveTo( 0, TICK_HEIGHT / 2 )
      .horizontalLineToRelative( LINE_LENGTH );

    var numberLinePath = new Path( numberLineShape, { stroke: 'black', lineWidth: 1 } );

    // Write the number beneath the number line for the symbol
    var numberText0 = new Text( 0 + '', { font: new PhetFont( FONT_SIZE ), centerX: 0, top: TICK_HEIGHT } );

    var numberText1 = new Text( 1 + '', { font: new PhetFont( FONT_SIZE ), centerX: LINE_LENGTH, top: TICK_HEIGHT } );

    // pass numberLinePath and both numberText as children to this node
    options.children = [ numberLinePath, numberText0, numberText1 ];

    Node.call( this, options );
  }

  fractionsIntro.register( 'NumberLineIcon', NumberLineIcon );

  return inherit( Node, NumberLineIcon );

} );