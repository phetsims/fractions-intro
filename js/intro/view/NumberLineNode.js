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
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<number>} maxNumberOfUnitsProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( maxNumberOfUnitsProperty, denominatorProperty, options ) {
    Node.call( this );

    // main Number line
    var mainNumberLine = new Line( 0, 0, IntroConstants.NUMBER_LINE_WIDTH, 0, { stroke: 'black' } );
    this.addChild( mainNumberLine );

    // Major Ticks
    var majorTicksNode = new Node();
    this.addChild( majorTicksNode );

    // Minor Ticks
    var minorTicksNode = new Node();
    this.addChild( minorTicksNode );

    // Present for the lifetime of the simulation
    // Updates the minor and major ticks as well as the main number line
    Property.multilink( [ maxNumberOfUnitsProperty, denominatorProperty ], function( maxNumberOfUnits, denominator ) {
      var segmentLength = IntroConstants.NUMBER_LINE_WIDTH / IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.max;

      // sets the length of the main number line
      mainNumberLine.setX2( segmentLength * maxNumberOfUnits );

      // lays out the major ticks
      majorTicksNode.removeAllChildren();
      for ( var i = 0; i <= maxNumberOfUnits; i++ ) {

        // major tick line width varies for even and odd number of units
        var majorTickLineWidth = (i % 2) ? 3 : 5;
        var majorTickLine = new Line( i * segmentLength, -IntroConstants.MAJOR_TICK_LENGTH, i * segmentLength, IntroConstants.MAJOR_TICK_LENGTH,
          { stroke: 'black', lineWidth: majorTickLineWidth } );
        majorTicksNode.addChild( majorTickLine );
      }

      // lays out the minor ticks
      var minorTickSeparation = segmentLength / denominator;
      minorTicksNode.removeAllChildren();
      for ( var j = 0; j <= maxNumberOfUnits * denominator; j++ ) {

        // skips major tick lines
        if ( j % denominator !== 0 ) {
          var minorTickLine = new Line( j * minorTickSeparation, -IntroConstants.MINOR_TICK_LENGTH, j * minorTickSeparation,
            IntroConstants.MINOR_TICK_LENGTH, { stroke: 'black' } );
          minorTicksNode.addChild( minorTickLine );
        }
      }
    } );
    this.mutate( options );
  }

  fractionsIntro.register( 'NumberLineNode', NumberLineNode );

  return inherit( Node, NumberLineNode );
} );