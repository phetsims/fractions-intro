// Copyright 2017, University of Colorado Boulder

/**
 * The number line with adjustable ticks
 * In a horizontal orientation, the number line goes from left to right, whereas it is
 * go from bottom to up in vertical orientation.
 *
 * @author Vincent Davis (Berea College)
 * @author Dusty Cole (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var HIGHLIGHTER_PADDING_HEIGHT = 5;
  var MARKER_CIRCLE_RADIUS = 12;
  var ARROW_LENGTH = 30;
  var ARROW_VERTICAL_OFFSET = 10;

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty - control the upper bound of the number line
   * @param {Property.<number>} multiplicationFactorProperty - ratio of the tick on the
   *                                                            upper and lower side of the number line
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( numeratorProperty,
                           denominatorProperty,
                           maxProperty,
                           multiplicationFactorProperty,
                           options ) {

    options = _.extend( {
        rotation: 0,  // horizontal -> 0, vertical -> -Math.PI/2

        //This gives the user option to add an arrow to the numberline if set to true
        displayArrow: false
      },
      options );

    // main Number line
    // the point (0,0) is set as the origin of of the number line
    var mainNumberLine = new Line( 0, 0, IntroConstants.NUMBER_LINE_WIDTH, 0, { stroke: 'black', lineWidth: 3 } );

    // for even major ticks, the lineWidth is slightly thicker than for odd Major Ticks
    var evenMajorTicksPath = new Path( null, { stroke: 'black', lineWidth: 5 } );

    // odd Major Ticks
    var oddMajorTicksPath = new Path( null, { stroke: 'black', lineWidth: 3 } );

    // Minor Ticks
    var minorTicksPath = new Path( null, { stroke: 'black' } );

    // node for number text label under major ticks
    var numbersNode = new Node();

    // distance between 0 and 1 on the number Line
    var segmentLength = IntroConstants.NUMBER_LINE_WIDTH / IntroConstants.MAX_RANGE.max;

    // Present for the lifetime of the simulation
    // Updates the minor and major ticks as well as the main number line
    Property.multilink( [ maxProperty, denominatorProperty ], function( max, denominator ) {

      // sets the length of the main number line
      mainNumberLine.x2 = segmentLength * max;

      // create major ticks shape
      var evenMajorTicksShape = new Shape();
      var oddMajorTicksShape = new Shape();

      // Remove number nodes, number node will be added later on
      numbersNode.removeAllChildren();

      for ( var i = 0; i <= max; i++ ) {

        // major tick line width varies for even and odd number of units
        var shape = i % 2 === 0 ? evenMajorTicksShape : oddMajorTicksShape;
        shape.moveTo( i * segmentLength, -IntroConstants.MAJOR_TICK_LENGTH / 2 )
          .verticalLineTo( IntroConstants.MAJOR_TICK_LENGTH / 2 );

        numbersNode.addChild( new Text( i, {
          font: IntroConstants.NUMBER_LINE_FONT,
          centerX: i * segmentLength,
          top: IntroConstants.MAJOR_TICK_LENGTH / 2,
          rotation: -options.rotation // rotate the opposite way than this node so that the text is right side up.
        } ) );
      }
      evenMajorTicksPath.setShape( evenMajorTicksShape );
      oddMajorTicksPath.setShape( oddMajorTicksShape );

      // lays out the minor ticks
      var minorTicksShape = new Shape();
      var multiplicationFactor = multiplicationFactorProperty.value;

      // the smallest distance between two adjacent ticks
      var minorTickSeparation = segmentLength / (denominator * multiplicationFactor);
      var numberOfTicks = max * denominator * multiplicationFactor;
      for ( var j = 0; j <= numberOfTicks; j++ ) {

        // skips major tick lines
        if ( j % (denominator * multiplicationFactor) !== 0 ) {

          // if true make a symmetric tick if false make half of a tick in the direction of choosing
          // determine if the tick need to be on one side or both side
          var isSymmetric = ( j % multiplicationFactor === 0 );
          minorTicksShape.moveTo( j * minorTickSeparation, isSymmetric ? -IntroConstants.MINOR_TICK_LENGTH / 2 : 0 )
            .verticalLineTo( IntroConstants.MINOR_TICK_LENGTH / 2 );
        }
      }
      minorTicksPath.setShape( minorTicksShape );
    } );

    // initializes a unique markerCircle if displayArrow = false
    var markerCircle = new Circle( MARKER_CIRCLE_RADIUS, { fill: 'green', lineWidth: 3, stroke: 'black' } );

    if ( options.displayArrow ) {
      markerCircle.setOpacity( 0.7 );
      markerCircle.fill = '#ff5eaf';
    }

    //marker Arrow indicating the fraction and marker circle
    var markerArrow = new ArrowNode( 0, -ARROW_LENGTH, 0, 0, {
      fill: '#ff5eaf',
      opacity: 0.7,
      visible: options.displayArrow
    } );

    // highlighter region for the marker
    var highlighterRectangle = new Rectangle( 0, 0, MARKER_CIRCLE_RADIUS * 2,
      (IntroConstants.MAJOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT), {
        fill: 'yellow',
        centerX: 0,
        centerY: 0
      } );

    // update position of the circle marker and the highlighter region based on the values of the numerator
    // denominator
    Property.multilink( [ numeratorProperty, denominatorProperty ], function( numerator, denominator ) {
      markerCircle.centerX = segmentLength * numerator / denominator;

      // Enables or Disables the ArrowNode
      if ( options.displayArrow ) {

        //Centers the marker arrow with respect to the number line
        markerArrow.centerX = markerCircle.centerX;

        // markerArrow moves vertically depending on the position of the tick marks
        if ( numerator / denominator % 1 === 0 ) {
          markerArrow.bottom = -IntroConstants.MAJOR_TICK_LENGTH / 2 - ARROW_VERTICAL_OFFSET;
        }
        else {
          markerArrow.bottom = -IntroConstants.MINOR_TICK_LENGTH / 2 - ARROW_VERTICAL_OFFSET;
        }

      }

      // highlighted region scales differently depending on the position of the tick marks
      if ( numerator / denominator % 1 === 0 ) {
        highlighterRectangle.setRectHeight( IntroConstants.MAJOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT );

      }
      else {
        highlighterRectangle.setRectHeight( IntroConstants.MINOR_TICK_LENGTH + HIGHLIGHTER_PADDING_HEIGHT );

      }
      highlighterRectangle.center = markerCircle.center;
    } );

    // add a drag handler to the circle on the number line
    markerCircle.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      drag: function( event ) {
        if ( options.rotation === 0 ) {
          var x = markerCircle.globalToParentPoint( event.pointer.point ).x;
          var tickMarkSeparation = segmentLength / denominatorProperty.value;

          // update the value of the numerator ensuring that it is always an integer
          // recall the x=0, y=0 is conveniently set at the zero of the number line
          // no need to update the position of any view elements since the numeratorProperty has callbacks to them
          numeratorProperty.value = Util.clamp( Util.roundSymmetric( x / tickMarkSeparation ),
            0, denominatorProperty.value * maxProperty.value );
        }
      }
    } ) );

    // Specify the children to be rendered with this node
    options.children = [
      highlighterRectangle,
      mainNumberLine,
      evenMajorTicksPath,
      oddMajorTicksPath,
      minorTicksPath,
      numbersNode,
      markerArrow,
      markerCircle ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'NumberLineNode', NumberLineNode );

  return inherit( Node, NumberLineNode, {} );
} );