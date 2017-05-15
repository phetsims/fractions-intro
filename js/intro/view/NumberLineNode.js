// Copyright 2017, University of Colorado Boulder

/**
 * The horizontal number line that shows the values
 *
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var HIGHLIGHTER_PADDING_HEIGHT = 5;
  var MARKER_CIRCLE_RADIUS = 12;

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxNumberOfUnitsProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( numeratorProperty, denominatorProperty, maxNumberOfUnitsProperty, options ) {

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

    // node for number text label under major ticks
    var numbersNode = new Node();

    // distance between 0 and 1
    var segmentLength = IntroConstants.NUMBER_LINE_WIDTH / IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.max;

    // Present for the lifetime of the simulation
    // Updates the minor and major ticks as well as the main number line
    Property.multilink( [ maxNumberOfUnitsProperty, denominatorProperty ], function( maxNumberOfUnits, denominator ) {

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
          top: IntroConstants.MAJOR_TICK_LENGTH / 2
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

    // marker circle indicating the fraction
    var markerCircle = new Circle( MARKER_CIRCLE_RADIUS, { fill: 'green', lineWidth: 3, stroke: 'black' } );

    // highlighter region for the marker
    var highlighterRectangle = new Rectangle( 0, 0, MARKER_CIRCLE_RADIUS * 2,
      (IntroConstants.MAJOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT), {
        fill: 'yellow',
        centerX: 0,
        centerY: 0
      } );

    // update position of the circle marker and the highlighter region
    Property.multilink( [ numeratorProperty, denominatorProperty ], function( numerator, denominator ) {
      markerCircle.centerX = segmentLength * numerator / denominator;

      // highlighted region scales differently depending on the position of the tick marks
      if ( numerator / denominator % 1 === 0 ) {
        highlighterRectangle.setRectHeight( IntroConstants.MAJOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT );
      }
      else {
        highlighterRectangle.setRectHeight( IntroConstants.MINOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT );
      }
      highlighterRectangle.centerX = markerCircle.centerX;
      highlighterRectangle.centerY = markerCircle.centerY;
    } );

    // Specify the children to be rendered with this node
    options.children = [
      highlighterRectangle,
      mainNumberLine,
      evenMajorTicksPath,
      oddMajorTicksPath,
      minorTicksPath,
      numbersNode,
      markerCircle ];

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