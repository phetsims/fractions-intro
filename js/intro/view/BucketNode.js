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
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Text = require( 'SCENERY/nodes/Text' );

  //constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

  /**
   *
   * @param {Property.<number>} representationProperty
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( representationProperty, options ) {
    var self = this;
    options = _.extend( {
      bucketPosition: new Vector2( 500, 480 ),
      bucketSize: new Dimension2( 200, 110 )
    }, options );

    Node.call( this, options );

    // Bucket model to be filled with dataPoint
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

    var circle = new Circle( 50000, {
      fill: 'red'
    } );

    var bucketHole = new BucketHole( this.bucket, IDENTITY_TRANSFORM );

    representationProperty.link( function( representation ) {
      switch( representation ) {
        case 'number-line':
          options.children = [];
          break;
        case 'circle':
          bucketFront.setLabel( circle );
          options.children = [ bucketHole, bucketFront ];
          break;
        default:
          bucketFront.setLabel( new Text( 'work?', {
            font: new PhetFont( 20 ),
            fill: 'red'
          } ) );
          options.children = [ bucketHole, bucketFront ];
          break;
      }
      self.mutate( options );
    } );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );
  return inherit( Node, BucketNode, {} );
} );
