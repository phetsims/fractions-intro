// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for displaying bucketNode and pieces in bucketNode slice in fractions-intro
 * @author Vincent Davis (Berea College)
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
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

  var PIECE_OFFSET_POSITIONS = [

    // Offsets used for initial position of pieces, relative to bucket hole center. Empirically determined.
    new Vector2( -120, 4 ),
    new Vector2( -85, 5 ),
    new Vector2( -40, 9 ),
    new Vector2( 0, 0 ),
    new Vector2( 37, 7 ),
    new Vector2( 75, 5 ),
    new Vector2( 110, 5 )
  ];

  /**
   * @param {Property.<number>} denominatorProperty
   * @param {Node} pieceLayer
   * @param {function} startBeakerDrag
   * @param {function} createCellNode
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( denominatorProperty, pieceLayer, startBeakerDrag, createCellNode, options ) {

    options = _.extend( {}, options );

    // model of the bucket
    var bucket = new Bucket( {
      position: IntroConstants.BUCKET_POSITION,
      baseColor: '#8eb7f2',
      size: IntroConstants.BUCKET_SIZE,
      invertY: true
    } );

    // @public (read-only) {Vector2}
    this.position = bucket.position;

    // creates bucketNode front
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );

    // creates hole of bucketNode
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );

    // creates a white rectangle beneath the bucketNode to prevent slices to appear below the bucketNode
    var underneathRectangle = new Rectangle( {
      rectWidth: bucketFront.width * 0.8,
      rectHeight: 150,
      fill: 'white',
      centerX: bucketHole.centerX,
      top: bucketFront.bottom - 30
    } );

    // options for the label
    var fractionNodeOptions = {
      font: new PhetFont( 20 ),
      dividingLineLength: 15,
      dividingLineWidth: 2
    };

    var staticLayer = new Node();

    denominatorProperty.link( function( denominator ) {
      staticLayer.removeAllChildren();
      PIECE_OFFSET_POSITIONS.forEach( function( position ) {
        var staticCellNode = createCellNode( denominator, 0, { center: position.plus( bucketHole.center ) } );
        staticLayer.addChild( staticCellNode );
      } );
    } );

    // add a fraction to the label of the form 1/D
    bucketFront.setLabel( new FractionNode( new NumberProperty( 1 ), denominatorProperty, fractionNodeOptions ) );

    options.children = [ underneathRectangle, bucketHole, staticLayer, pieceLayer, bucketFront ];
    Node.call( this, options );

    this.addInputListener( {
      down: function( event ) {
        startBeakerDrag( event );
      }
    } );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );

  return inherit( Node, BucketNode );
} );
