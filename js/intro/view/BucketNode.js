// Copyright 2017, University of Colorado Boulder

/**
 * Node for creating Buckets in fractions-intro
 * Buckets hold the sections for creating a selected shape.
 * @author Vincent Davis (Berea College)
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var DATA_POINT_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of point, relative to bucket hole center. Empirically determined.
    new Vector2( -90, -4 ),
    new Vector2( -55, -5 ),
    new Vector2( 100, -5 ),
    new Vector2( -25, -9 ),
    new Vector2( 10, -3 ),
    new Vector2( 35, -5 )
  ];

  /**
   *
   * @param {Property.<number>} representationProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} segmentProperty
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( representationProperty, denominatorProperty, segmentProperty, options ) {
    var self = this;
    options = _.extend( {
      bucketPosition: new Vector2( 570, 497 ),
      bucketSize: new Dimension2( 355, 125 )
    }, options );

    Node.call( this, options );

    // Bucket model to be filled with shape sections
    // @public read-only
    this.bucket = new Bucket( {
      position: options.bucketPosition,
      baseColor: '#8eb7f2',
      size: options.bucketSize,
      invertY: true,
      caption: 'hello',
      captionColor: 'red'
    } );
    var bucketFront = new BucketFront( this.bucket, IDENTITY_TRANSFORM, {
      labelNode: new Circle( 10, {
        fill: 'red'
      } )
    } );

    var beakerIcon = new BeakerNode( denominatorProperty, segmentProperty, {
      beakerWidth: IntroConstants.BEAKER_WIDTH / 4,
      beakerHeight: IntroConstants.BEAKER_LENGTH / 4,
      tickWidth: 1
    } );

    // this function creates an HBox with an icon and a fraction
    var createLabelBox = function( icon ) {
      var fractionNode = new FractionNode( new NumberProperty( 1 ), denominatorProperty, new NumberProperty( 1 ),
        { interactive: false, font: new PhetFont( { size: 22 } ), dividingLineLength: 25, dividingLineWidth: 2 } );
      return new HBox( {
        align: 'center',
        spacing: 20,
        children: [ icon, fractionNode ]
      } );
    };

    var beakersLayer = new Node();

    var bucketHole = new BucketHole( this.bucket, IDENTITY_TRANSFORM );

    DATA_POINT_CREATOR_OFFSET_POSITIONS.forEach( function( position ) {
      beakersLayer.addChild( new BeakerNode( denominatorProperty, segmentProperty, {
        beakerWidth: IntroConstants.BEAKER_WIDTH,
        beakerHeight: IntroConstants.BEAKER_LENGTH,
        tickWidth: 1,
        centerX: position.x + bucketHole.centerX,
        centerY: position.y + bucketHole.centerY + 15
      } ) );
    } );

    representationProperty.link( function( representation ) {
      switch( representation ) {
        case 'number-line':
          options.children = [];
          break;
        case 'beaker':
          bucketFront.setLabel( createLabelBox( beakerIcon ) );
          options.children = [ bucketHole, beakersLayer, bucketFront ];
          break;
        default:
          bucketFront.setLabel( createLabelBox( new Node() ) );
          options.children = [ bucketHole, bucketFront ];
          break;
      }
      self.mutate( options );
    } );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );
  return inherit( Node, BucketNode );
} );
