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

  /**
   *
   *
   * @constructor
   */
  function NumberLineNode() {
    Node.call( this );

  }

  fractionsIntro.register( 'NumberLineNode', NumberLineNode );

  return inherit( Node, NumberLineNode );
} );