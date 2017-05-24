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
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

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
      bucketPosition: new Vector2( 500, 480 ),
      bucketSize: new Dimension2( 200, 110 )
    }, options );

    Node.call( this, options );

    // Bucket model to be filled with shape sections
    // @public read-only
    this.bucket = new Bucket( {
      position: options.bucketPosition,
      baseColor: '#000080',
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
      beakerWidth: 17,
      beakerHeight: 40,
      tickWidth: 1
    } );

    // this function creates an HBox with an icon and a fraction
    var createLabelBox = function( icon ) {
      var fractionNode = new FractionNode( new NumberProperty( 1 ), denominatorProperty, new NumberProperty( 1 ),
        { interactive: false, font: new PhetFont( { size: 24 } ), dividingLineLength: 14, dividingLineWidth: 2 } );
      return new HBox( {
        align: 'center',
        spacing: 10,
        children: [ icon, fractionNode ]
      } );
    };

    var bucketHole = new BucketHole( this.bucket, IDENTITY_TRANSFORM );
    representationProperty.link( function( representation ) {
      switch( representation ) {
        case 'number-line':
          options.children = [];
          break;
        case 'beaker':
          bucketFront.setLabel( createLabelBox( beakerIcon ) );
          options.children = [ bucketHole, bucketFront ];
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
