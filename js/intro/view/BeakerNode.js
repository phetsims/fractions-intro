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
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} filledProperty
   * @param {object} [options]
   * @constructor
   */
  function BeakerNode( denominatorProperty, filledProperty, options ) {

    options = _.extend( {
      beakerWidth: 10,
      beakerHeight: 70,
      perspectiveFactor: 0.2 // multiplier that controls the width of the ellipses on the ends of the cylinder
    }, options );

    // gradient to be used when liquid fills beaker
    var fullCapFillGradient = new LinearGradient( -options.beakerWidth / 2, 0, options.beakerWidth / 2, 0 )
      .addColorStop( 0, '#72D2F2' )
      .addColorStop( 1, '#72D2F2' );

    // set the gradient on the surface of the empty Beaker to make it look more 3D
    var emptyFillGradient = new LinearGradient( -options.beakerWidth / 2, 0, options.beakerWidth / 2, 0 )
      .addColorStop( 0, '#a9a9a9' )
      .addColorStop( 0.666, '#FFF' )
      .addColorStop( 0.782, '#FCFCFC' )
      .addColorStop( 1, '#a9a9a9' );

    // set the gradient on the surface of Beaker to make it look more 3D
    var liquidFillGradient = new LinearGradient( -options.beakerWidth / 2, 0, options.beakerWidth / 2, 0 )
      .addColorStop( 0, '#1EC1F8' )
      .addColorStop( 0.666, '#FFF' )
      .addColorStop( 0.782, '#FCFCFC' )
      .addColorStop( 1, '#1EC1F8' );

    // beakerContainer holds liquidInBeaker
    var beakerContainer = new Node();

    // emptyBeaker is a background for liquidInBeaker
    var emptyBeaker = createCylinder( options.beakerWidth, options.beakerHeight, options.perspectiveFactor,
      emptyFillGradient, emptyFillGradient );

    // node for ticks
    var tickMarksPath = new Path( null, { stroke: 'black', lineWidth: 3 } );

    // updates ticks when denominator is changed
    denominatorProperty.link( function( denominator ) {

      // tickSeparation determines how far tick marks on beaker should be spread out
      var tickSeparation = options.beakerHeight / denominator;
      var tickMarksShape = new Shape();
      for ( var i = 1; i <= denominator; i++ ) {

        // ticks should be longer if they are even
        var rotationAngle = ( i % 2 === 0 ) ? Math.PI / 4 : Math.PI / 6;
        tickMarksShape.moveTo( -options.beakerWidth / 2, -tickSeparation * (i) );
        tickMarksShape.ellipticalArc( 0, -tickSeparation * i, options.beakerWidth / 2,
          options.beakerWidth * options.perspectiveFactor / 2, 0, Math.PI, Math.PI - rotationAngle, true );
      }
      tickMarksPath.setShape( tickMarksShape );
    } );

    // updates how 'full' beaker is when fraction is changed
    filledProperty.link( function( fraction ) {
      var height = fraction * options.beakerHeight;

      // gradient should change if beaker is full of liquid
      var capFillGradient = (height === options.beakerHeight) ? fullCapFillGradient : liquidFillGradient;
      beakerContainer.removeAllChildren();

      // will not draw the liquid if the beaker is empty
      if ( height !== 0 ) {
        var liquidInBeaker = createCylinder( options.beakerWidth, height, options.perspectiveFactor,
          liquidFillGradient, capFillGradient, { isLiquid: true } );
        beakerContainer.addChild( liquidInBeaker );
      }
    } );

    // add children to scene graph. z order matters here.
    options.children = [ emptyBeaker, beakerContainer, tickMarksPath ];
    Node.call( this, options );

  }

  /**
   * Creates both the empty beaker and filled beaker
   * @param {number} width - width of the cylinder
   * @param {number} height - height of the cylinder
   * @param {number} perspectiveFactor - multiplier that controls the width of the ellipses on the ends of the cylinder
   * @param {LinearGradient} mainGradient - gradient to be used for body of the cylinder
   * @param {LinearGradient} capGradient - gradient to be used for capGradient ellipse
   * @param {object} [options]
   * @returns {Node}
   */

  var createCylinder = function( width, height, perspectiveFactor, mainGradient, capGradient, options ) {
    options = _.extend( {
      isLiquid: false
    }, options );

    // body of the beaker
    var bodyPath = new Path( new Shape().moveTo( width / 2, -height )
      .verticalLineToRelative( height )
      .ellipticalArc( 0, 0, width / 2, width * perspectiveFactor / 2, 0, 2 * Math.PI, Math.PI, false )
      .verticalLineToRelative( -height )
      .close(), {
      fill: mainGradient
    } );

    // top ellipse of the beaker
    var capPath = new Path( Shape.ellipse( 0, -height, width / 2, width * perspectiveFactor / 2 ), {
      fill: capGradient
    } );

    // an arc should appear at top of the liquid to provide depth
    var liquidArc = new Path( null );
    if ( options.isLiquid ) {
      liquidArc = new Path( new Shape().ellipticalArc( 0, -height, width / 2, width * perspectiveFactor / 2,
        0, Math.PI, 2 * Math.PI, true ),
        {
          stroke: 'black',
          lineWidth: 1
        } );
    }

    // set the gradient on the cap to be the reverse of the beaker if it is not liquid
    else {
      capPath.setScaleMagnitude( -1, 1 );
    }

    // creates the base arc of the beaker to add depth
    var backsideBottomArc = new Path( new Shape().ellipticalArc( 0, 0, width / 2, width * perspectiveFactor / 2,
      0, 2 * Math.PI, Math.PI, true ),
      {
        stroke: 'grey',
        lineWidth: 1
      } );

    return new Node( {
      children: [ bodyPath, backsideBottomArc, capPath, liquidArc ]
    } );
  };
  fractionsIntro.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode, {} );

} );