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

      setOfBeakerNode.removeAllChildren();

      // loop over all the containers in the container set
      containerSet.containers.forEach( function( container, containerIndex ) {

        var fractionProperty = container.fractionProperty;
        var containerNode = new Node();

        // creates a new beakerNode to display on screen
        var containerBeakerNode = new createBeakerNode( containerSet, fractionProperty, options );

        containerBeakerNode.centerX = 512 + (options.containerWidth + options.containerSpacing) *
                                            (containerIndex - (containerSet.containers.length - 1) / 2);

        containerBeakerNode.centerY = 260;

        containerNode.addChild( containerBeakerNode );
        setOfBeakerNode.addChild( containerNode );

      } );
    };

    // needs to be called once or the beginning state of the containers will not be displayed

    containerSet.maxProperty.link(function(){
      self.displayContainers();
    });

    // add listener to container sets
    containerSet.containersEmitter.addListener( function() {
      containerSet.containers.forEach( function( container ) {
        container.fractionProperty.value = container.getFraction();

      } );
    } )
  }

  /**
   * @param (ContainerSet) containerSet
   * @param (Property.<number>) fraction
   * @param {object} [options]
   * @returns {Node}
   */
  var createBeakerNode = function( containerSet, fractionProperty, options ) {

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
    var radius = options.beakerWidth / 2;

    // set the gradient on the surface of the empty Beaker to make it look more 3D
    var emptyFillGradient = new LinearGradient( -radius, 0, radius, 0 )
      .addColorStop( 0, EMPTY_BEAKER_COLOR )
      .addColorStop( 0.666, BEAKER_SHINE_COLOR )
      .addColorStop( 0.782, BEAKER_SHINE_COLOR )
      .addColorStop( 1, EMPTY_BEAKER_COLOR );

    // set the gradient on the surface of Beaker to make it look more 3D
    var liquidFillGradient = new LinearGradient( -radius, 0, radius, 0 )
      .addColorStop( 0, LIQUID_COLOR )
      .addColorStop( 0.666, BEAKER_SHINE_COLOR )
      .addColorStop( 0.782, BEAKER_SHINE_COLOR )
      .addColorStop( 1, LIQUID_COLOR );

    // beakerContainer holds liquidInBeaker
    var beakerContainer = new Node();

    //bottom layer
    // emptyBeakerBackside is the backside of the beaker
    var emptyBeakerBackside = new Path( new Shape().moveTo( -radius, 0 )
        .ellipticalArc( 0, 0, radius, radius * options.perspectiveFactor, 0, Math.PI, 2 * Math.PI, false )
        .verticalLineToRelative( -options.beakerHeight )
        .ellipticalArc( 0, -options.beakerHeight, radius, radius * options.perspectiveFactor, 0, 2 * Math.PI, Math.PI, true )
        .verticalLineToRelative( options.beakerHeight ), {
        stroke: 'grey',
        fill: emptyFillGradient
      }
    );
    var emptyBeakerBottom = new Path( new Shape()
        .ellipse( 0, 0, radius, radius * options.perspectiveFactor ), {
        stroke: 'grey',
        fill: emptyFillGradient
      }
    );
    fractionProperty.link( function( fraction ) {
      //middle layer
      // updates how 'full' beaker is when fraction is changed
      var height = fraction * options.beakerHeight;

      // gradient should change if beaker is full of liquid
      var capFillGradient = (height === options.beakerHeight) ? FULL_CAP_COLOR : liquidFillGradient;
      beakerContainer.removeAllChildren();

      // will not draw the liquid if the beaker is empty
      if ( height !== 0 ) {
        var liquidInBeaker = createCylinder( radius, height, options.perspectiveFactor,
          liquidFillGradient, capFillGradient, { isLiquid: true } );
        beakerContainer.addChild( liquidInBeaker );
      }
    } );

    //top layer
    //front of the beaker and tick mark
    var BeakerFront = new Path( new Shape().moveTo( -radius, 0 )
        .ellipticalArc( 0, 0, radius, radius * options.perspectiveFactor, 0, Math.PI, 2 * Math.PI, true )
        .verticalLineToRelative( -options.beakerHeight )
        .ellipticalArc( 0, -options.beakerHeight, radius, radius * options.perspectiveFactor, 0, 2 * Math.PI, Math.PI, false )
        .verticalLineToRelative( options.beakerHeight ), {
        stroke: 'grey',
        fill: emptyFillGradient
      }
    );

    // node for ticks
    var tickMarksPath = new Path( null, { stroke: 'black', lineWidth: options.tickWidth } );

    // updates ticks when denominator is changed
    containerSet.denominatorProperty.link( function( denominator ) {

      // tickSeparation   determines how far tick marks on beaker should be spread out
      var tickSeparation = options.beakerHeight / denominator;
      var tickMarksShape = new Shape();
      for ( var i = 1; i <= denominator; i++ ) {

        // ticks should be longer if they are even
        var rotationAngle = ( i % 2 === 0 ) ? Math.PI / 4 : Math.PI / 6;
        tickMarksShape.moveTo( -radius, -tickSeparation * i );
        tickMarksShape.ellipticalArc( 0, -tickSeparation * i, radius,
          radius * options.perspectiveFactor, 0, Math.PI, Math.PI - rotationAngle, true );
      }
      tickMarksPath.setShape( tickMarksShape );
    } );

    // add children to scene graph. z order matters here.
    return new Node( {
      children: [ emptyBeakerBackside, emptyBeakerBottom, beakerContainer, BeakerFront, tickMarksPath ]
    } );

  };

  /**
   * Creates both the empty beaker and filled beaker
   * @param {number} radius - radius of the cylinder
   * @param {number} height - height of the cylinder
   * @param {number} perspectiveFactor - multiplier that controls the width of the ellipses on the ends of the cylinder
   * @param {LinearGradient|string} mainFill - gradient to be used for body of the cylinder
   * @param {LinearGradient|string} capFill - gradient to be used for capFill ellipse
   * @param {object} [options]
   * @returns {Node}
   */

  var createCylinder = function( radius, height, perspectiveFactor, mainFill, capFill, options ) {
    options = _.extend( {
      isLiquid: false
    }, options );

    // body of the beaker
    var bodyPath = new Path( new Shape().moveTo( radius, -height )
      .verticalLineToRelative( height )
      .ellipticalArc( 0, 0, radius, radius * perspectiveFactor, 0, 2 * Math.PI, Math.PI, false )
      .verticalLineToRelative( -height )
      .close(), {
      fill: mainFill
    } );

    // top ellipse of the beaker
    var capPath = new Path( Shape.ellipse( 0, -height, radius, radius * perspectiveFactor ), {
      fill: capFill
    } );

    // an arc should appear at top of the liquid to provide depth
    var liquidArc = new Path( null );
    if ( options.isLiquid ) {
      liquidArc = new Path( new Shape().ellipticalArc( 0, -height, radius, radius * perspectiveFactor,
        0, Math.PI, 2 * Math.PI, true ),
        {
          stroke: 'black'
        } );
    }

    // set the gradient on the cap to be the reverse of the beaker if it is not liquid
    else {
      capPath.setScaleMagnitude( -1, 1 );
    }

    // creates the base arc of the beaker to add depth
    var backsideBottomArc = new Path( new Shape().ellipticalArc( 0, 0, radius, radius * perspectiveFactor,
      0, 2 * Math.PI, Math.PI, true ),
      {
        stroke: 'grey'
      } );

    return new Node( {
      children: [ bodyPath, backsideBottomArc, capPath, liquidArc ]
    } );
  };
  fractionsIntro.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode, {} );
} );
