// Copyright 2017, University of Colorado Boulder

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
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<number>} maxNumberOfUnitsProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( maxNumberOfUnitsProperty, denominatorProperty, options ) {

    // Make sure the options exists
    options = _.extend( {}, options );

    // main Number line
    var mainNumberLine = new Line( 0, 0, IntroConstants.NUMBER_LINE_WIDTH, 0, { stroke: 'black' } );

    // Even Major Ticks, Width of line is slightly thicker than the odd Major Ticks
    var evenMajorTicksPath = new Path( null, { stroke: 'black', lineWidth: 5 } );

    // odd Major Ticks
    var oddMajorTicksPath = new Path( null, { stroke: 'black', lineWidth: 3 } );

    // Minor Ticks
    var minorTicksPath = new Path( null, { stroke: 'black', lineWidth: 1 } );

    //node for number text label under major ticks
    var numbersNode = new Node();

    // Present for the lifetime of the simulation
    // Updates the minor and major ticks as well as the main number line
    Property.multilink( [ maxNumberOfUnitsProperty, denominatorProperty ], function( maxNumberOfUnits, denominator ) {
      var segmentLength = IntroConstants.NUMBER_LINE_WIDTH / IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.max;

      // sets the length of the main number line
      mainNumberLine.setX2( segmentLength * maxNumberOfUnits );

      // create major ticks shape
      var evenMajorTicksShape = new Shape();
      var oddMajorTicksShape = new Shape();

      // Remove number nodes, number node will be added later on
      numbersNode.removeAllChildren();

      for ( var i = 0; i <= maxNumberOfUnits; i++ ) {

        // major tick line width varies for even and odd number of units
        if ( i % 2 === 0 ) {
          appendTick( evenMajorTicksShape, i * segmentLength, IntroConstants.MAJOR_TICK_LENGTH );
        }
        else {
          appendTick( oddMajorTicksShape, i * segmentLength, IntroConstants.MAJOR_TICK_LENGTH );
        }

        //add numbers under the major ticks
        var majorTickLabel = new Text( i, {
          font: IntroConstants.NUMBER_LINE_FONT,
          centerX: i * segmentLength,
          top: IntroConstants.MAJOR_TICK_LENGTH/2
        } );
        numbersNode.addChild( majorTickLabel );
      }
      evenMajorTicksPath.setShape( evenMajorTicksShape );
      oddMajorTicksPath.setShape( oddMajorTicksShape );

      // lays out the minor ticks
      var minorTicksShape = new Shape();
      var minorTickSeparation = segmentLength / denominator;
      for ( var j = 0; j <= maxNumberOfUnits * denominator; j++ ) {

        // skips major tick lines
        if ( j % denominator !== 0 ) {
          appendTick( minorTicksShape, j * minorTickSeparation, IntroConstants.MINOR_TICK_LENGTH );
        }
      }
      minorTicksPath.setShape( minorTicksShape );
    } );

    // Specify the children to be rendered with this node
    options.children = [ mainNumberLine, evenMajorTicksPath, oddMajorTicksPath, minorTicksPath, numbersNode ];

    Node.call( this, options );
  }

  /**
   * Append a tick mark to the specified shape.
   * @param {Shape} shape - the shape to append a tick mark to
   * @param {number} x - the x coordinate of the tick mark in view coordinates
   * @param {number} tickLength - the vertical extent of the tick mark in view coordinates
   */
  var appendTick = function( shape, x, tickLength ) {

    // Append a symmetric tick that straddles the number line
    shape.moveTo( x, -tickLength / 2 ).verticalLineTo( tickLength / 2 );
  };

  fractionsIntro.register( 'NumberLineNode', NumberLineNode );

  return inherit( Node, NumberLineNode, {} );
} );