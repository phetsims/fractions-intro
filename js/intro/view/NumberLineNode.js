// Copyright 2013-2017, University of Colorado Boulder

/**
 * The horizontal number line that shows the values
 *
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Line = require( 'SCENERY/nodes/Line' );

  /**
   *
   *
   * @constructor
   */
  function NumberLineNode() {
    Node.call( this );

    // main Numberline
    var mainNumberLine = new Line( 0, 0, IntroConstants.NUMBERLINE_WIDTH, 0, { stroke: 'black' } );
    this.addChild( mainNumberLine );
  }

  fractionsIntro.register( 'NumberLineNode', NumberLineNode );

  return inherit( Node, NumberLineNode );
} );