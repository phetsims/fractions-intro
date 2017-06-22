// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for displaying bucket and pieces in bucket slice in fractions-intro
 * @author Vincent Davis (Berea College)
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

  /**
   * @param {ContainerSet} containerSet
   * @param {ObservableArray.<Piece>} pieces
   * @param {Property.<number>} representationProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} segmentProperty
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( options ) {

    options = _.extend( {}, options );

    // Bucket model to be filled with piece
    var bucket = new Bucket( {
      position: IntroConstants.BUCKET_POSITION,
      baseColor: '#8eb7f2',
      size: IntroConstants.BUCKET_SIZE,
      invertY: true
    } );

    // creates bucket front
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );

    // creates hole of bucket
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );

    // creates a white rectangle beneath the bucket to prevent slices to appear below the bucket
    var underneathRectangle = new Rectangle( {
      rectWidth: bucketFront.width * 0.8,
      rectHeight: 150,
      fill: 'white',
      centerX: bucketHole.centerX,
      top: bucketFront.bottom - 30
    } );

    bucketFront.setLabel();

    options.children = [ underneathRectangle, bucketHole, bucketFront ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );
  return inherit( Node, BucketNode );
} );
