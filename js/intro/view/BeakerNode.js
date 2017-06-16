// Copyright 2017, University of Colorado Boulder

/**
 * Node for creating Beakers in fractions-intro
 * Beakers can either be empty, partially filled, or full.
 * @author Vincent Davis (Berea College)
 * @author Dusty Cole (Berea College)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var EMPTY_BEAKER_COLOR = 'rgba(150,150,150,0.2)';
  var LIQUID_COLOR = 'rgba(30,163,255,0.8)';
  var BEAKER_SHINE_COLOR = 'rgba(255,255,255,0.8)';

  // color to be used when liquid fills beaker
  var FULL_CAP_COLOR = 'rgba(70,200,238,0.8)';

  /**
   * @param {ContainerSet} containerSet
   * @param {object} [options]
   * @constructor
   */
  function BeakerNode( containerSet, options ) {

    options = _.extend( {
      beakerWidth: IntroConstants.BEAKER_WIDTH,
      beakerHeight: IntroConstants.BEAKER_LENGTH,
      tickWidth: 3,
      align: 'center',
      containerSpacing: 22,
      containerWidth: 130,
      containerHeight: 185,
      isIcon: false, //  is an icon without drag ability
      perspectiveFactor: 0.2 // multiplier that controls the width of the ellipses on the ends of the cylinder
    }, options );

    Node.call( this );

    // @private
    this.options = options;

    var self = this;

    // @private
    this.containerSet = containerSet;

    // A Node to hold the set of containers
    var setOfBeakerNode = new Node();
    this.addChild( setOfBeakerNode );

    // function for displaying the containers
    this.displayContainers = function() {

      // dispose of links from prior beaker nodes
      if ( setOfBeakerNode.hasChildren() ) {
        var beakerArray = setOfBeakerNode.getChildren();
        beakerArray.forEach( function( beakerNode ) {
          beakerNode.disposeBeakerNode();
        } );
      }
      setOfBeakerNode.removeAllChildren();

      // loop over all the containers in the container set
      containerSet.containers.forEach( function( container ) {

        // creates a new beakerNode to display on screen
        var containerBeakerNode = new createBeakerNode( container, options );

        // centers position of BeakerNode
        containerBeakerNode.center = container.positionProperty.value;

        setOfBeakerNode.addChild( containerBeakerNode );

      } );
    };

    // add listener to container sets
    containerSet.updatedContainersEmitter.addListener( function() {
      containerSet.containers.forEach( function( container, containerIndex ) {
        container.fractionProperty.value = container.getFraction();
        container.positionProperty.value = new Vector2( 512 + (options.containerWidth + options.containerSpacing) *
                                                              (containerIndex -
                                                               (containerSet.containers.length - 1) / 2), 260 );

        var cellHeight = options.beakerHeight / container.denominatorProperty.value;

        container.cells.forEach( function( cell, cellIndex ) {

          // offset the position of the fill to match the cell Height
          cell.positionProperty.value = container.positionProperty.value.plusXY( 0,
            options.beakerHeight - cellHeight * (cellIndex + 1) );
        } );
      } );
      self.displayContainers();
    } );
    containerSet.updatedContainersEmitter.emit();

    // needs to be called once or the beginning state of the containers will not be displayed
    self.displayContainers();
  }

  /**
   * @param {Container} container
   * @param {object} [options]
   * @returns {Node}
   */
  var createBeakerNode = function( container, options ) {

    options = _.extend( {
      beakerWidth: IntroConstants.BEAKER_WIDTH,
      beakerHeight: IntroConstants.BEAKER_LENGTH,
      tickWidth: 3,
      align: 'center',
      containerSpacing: 22,
      containerWidth: 130,
      containerHeight: 185,
      perspectiveFactor: 0.2 // multiplier that controls the width of the ellipses on the ends of the cylinder
    }, options );

    // radius to be used for Ellipses
    var xRadius = options.beakerWidth / 2;
    var yRadius = options.beakerWidth / 10;

    // set the gradient on the surface of the empty Beaker to make it look more 3D
    var emptyFillGradient = new LinearGradient( -xRadius, 0, xRadius, 0 )
      .addColorStop( 0, EMPTY_BEAKER_COLOR )
      .addColorStop( 0.666, BEAKER_SHINE_COLOR )
      .addColorStop( 0.782, BEAKER_SHINE_COLOR )
      .addColorStop( 1, EMPTY_BEAKER_COLOR );

    // beakerContainer holds liquidInBeaker
    var beakerContainer = new Node();

    // bottom layer
    // emptyBeakerBackside is the backside of the beaker
    var emptyBeakerBackside = new Path( new Shape()
      .ellipticalArc( 0, -options.beakerHeight, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, true ), {
      stroke: 'grey',
      fill: emptyFillGradient
    } );

    var emptyBeakerBottom = new Path( new Shape()
        .ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, 2 * Math.PI, false ), {
        stroke: 'grey',
        fill: EMPTY_BEAKER_COLOR
      }
    );
    var liquidHeightListener = function( fraction ) {
      // middle layer
      // updates how 'full' beaker is when fraction is changed
      var height = fraction * options.beakerHeight;

      // gradient should change if beaker is full of liquid
      var capFillGradient = (height === options.beakerHeight) ? FULL_CAP_COLOR : LIQUID_COLOR;
      beakerContainer.removeAllChildren();

      // will not draw the liquid if the beaker is empty
      if ( height !== 0 ) {
        var liquidTop = new Path( new Shape().ellipticalArc( 0, -height, xRadius, yRadius, 0, 0, Math.PI * 2, false ), {
          fill: capFillGradient
        } );
        var liquidInBeaker = new Path( new Shape()
          .ellipticalArc( 0, -height, xRadius, yRadius, 0, Math.PI, 0, true )
          .ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, false ), {
          stroke: 'grey',
          fill: LIQUID_COLOR
        } );
        beakerContainer.addChild( liquidInBeaker );
        beakerContainer.addChild( liquidTop );
      }
    };
    container.fractionProperty.link( liquidHeightListener );

    // top layer
    // front of the beaker and tick mark
    var beakerFront = new Path( new Shape().ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, -options.beakerHeight, xRadius, yRadius, 0, Math.PI, 0, true ), {
      stroke: 'grey',
      fill: emptyFillGradient
    } );

    // minor tick shape
    var minorTickMarkShape = new Shape().ellipticalArc( 0, 0, xRadius,
      xRadius * options.perspectiveFactor, 0, Math.PI, 3 * Math.PI / 4, true );

    // major tick shape
    var majorTickMarkShape = new Shape().ellipticalArc( 0, 0, xRadius,
      xRadius * options.perspectiveFactor, 0, Math.PI, 5 * Math.PI / 6, true );

    // layer of tick to be add to scene graph
    var tickLayer = new Node();

    // updates ticks when denominator is changed
    var denominatorPropertyListener = function( denominator ) {

      var minorTickLocation = [];

      var majorTickLocation = [];

      var tickSeparation = -(options.beakerHeight / denominator);

      for ( var i = 1; i <= denominator; i++ ) {
        if ( i % 2 === 0 ) {
          minorTickLocation.push( tickSeparation * i );
        }
        else {
          majorTickLocation.push( tickSeparation * i );
        }
      }

      // add tick shapes to new node
      var minorTickNodes = minorTickLocation.map( function( y ) {
        return new Path( minorTickMarkShape, { y: y, stroke: 'black', lineWidth: options.tickWidth } );
      } );
      var majorTickNodes = majorTickLocation.map( function( y ) {
        return new Path( majorTickMarkShape, { y: y, stroke: 'black', lineWidth: options.tickWidth } );
      } );

      var tickNodes = minorTickNodes.concat( majorTickNodes );

      tickLayer.setChildren( tickNodes );

    };

    container.denominatorProperty.link( denominatorPropertyListener );

    // add children to scene graph. z order matters here.
    var beakerNode = new Node( {
      children: [ emptyBeakerBackside, emptyBeakerBottom, beakerContainer, beakerFront, tickLayer ]
    } );

    beakerNode.disposeBeakerNode = function() {
      container.fractionProperty.unlink( liquidHeightListener );
      container.denominatorProperty.unlink( denominatorPropertyListener );
    };

    // creates bounds for the container
    container.boundsProperty.value = beakerNode.bounds.shifted(
      container.positionProperty.value.x, container.positionProperty.value.y ).dilatedXY( 20, 100 );

    // creates bounds for every cell in container
    container.cells.forEach( function( cell ) {
      cell.boundsProperty.value = container.boundsProperty.value;

    } );

    return beakerNode;
  };

  fractionsIntro.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode, {} );
} );
