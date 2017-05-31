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
  var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Piece = require( 'FRACTIONS_INTRO/intro/model/Piece' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
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
   * @param {ObservableArray.<Piece>} pieces
   * @param {Property.<number>} representationProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} segmentProperty
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( pieces, representationProperty, denominatorProperty, segmentProperty, options ) {

    var self = this;

    options = _.extend( {
      bucketPosition: new Vector2( 570, 497 ),
      bucketSize: new Dimension2( 355, 125 )
    }, options );

    Node.call( this, options );

    var modelViewTransform = IDENTITY_TRANSFORM;

    // Bucket model to be filled with piece
    var bucket = new Bucket( {
      position: options.bucketPosition,
      baseColor: '#8eb7f2',
      size: options.bucketSize,
      invertY: true
    } );

    // creates bucket front
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );

    // creates beaker icon on bucket node
    var beakerIcon = new BeakerNode( denominatorProperty, segmentProperty, {
      beakerWidth: IntroConstants.BEAKER_WIDTH / 4,
      beakerHeight: IntroConstants.BEAKER_LENGTH / 4,
      tickWidth: 1
    } );

    // creating cake icon with one slice
    var cakeIcon = new CakeNode( new NumberProperty( 1 ), denominatorProperty );

    // this function creates an HBox with an icon and a fraction
    var createLabelBox = function( icon ) {
      var fractionNode = new FractionNode( new NumberProperty( 1 ), denominatorProperty,
        { font: new PhetFont( { size: 22 } ), dividingLineLength: 25, dividingLineWidth: 2 } );
      return new HBox( {
        align: 'center',
        spacing: 20,
        children: [ icon, fractionNode ]
      } );
    };

    // node to collect all pieces in the bucket
    var piecesNode = new Node();

    // creating hole of bucket
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );

    representationProperty.link( function( representation ) {
      switch( representation ) {
        case Representation.CAKE:
          bucketFront.setLabel( createLabelBox( cakeIcon ) );
          options.children = [ bucketHole, bucketFront ];
          break;
        case Representation.NUMBER_LINE:
          options.children = [];
          break;
        case Representation.BEAKER:
          bucketFront.setLabel( createLabelBox( beakerIcon ) );
          options.children = [ bucketHole, piecesNode, bucketFront ];
          break;
        default:
          bucketFront.setLabel( createLabelBox( new Node() ) );
          options.children = [ bucketHole, bucketFront ];
          break;
      }
      self.mutate( options );
    } );

    // pieces in the bucket
    DATA_POINT_CREATOR_OFFSET_POSITIONS.forEach( function( position ) {

      // TODO: generalize to other shapes
      var pieceNode = new BeakerNode( denominatorProperty, segmentProperty, {
        beakerWidth: IntroConstants.BEAKER_WIDTH,
        beakerHeight: IntroConstants.BEAKER_LENGTH,
        tickWidth: 3,
        centerX: position.x + bucketHole.centerX,
        centerY: position.y + bucketHole.centerY + 15
      } );
      pieceNode.addInputListener( createDragHandler( pieceNode.center ) );
      piecesNode.addChild( pieceNode );
    } );

    /**
     * create a drag handler that adds a piece to the model
     * @param {Vector2} centerPosition - centerPosition of the shape
     * @returns {SimpleDragHandler}
     */
    function createDragHandler( centerPosition ) {
      var piece = null;
      var dragHandler = new SimpleDragHandler( {

        allowTouchSnag: true,

        start: function() {

          // create a model piece
          var modelPosition = modelViewTransform.viewToModelPosition( centerPosition );
          piece = new Piece( {
            position: modelPosition,
            dragging: true
          } );

          // add the model piece to the observable array
          pieces.add( piece );
        },

        translate: function( translationParams ) {
          piece.positionProperty.value = piece.positionProperty.value.plus( modelViewTransform.viewToModelDelta( translationParams.delta ) );
        },

        end: function() {
          piece.draggingProperty.set( false );
          piece = null;
        }
      } );

      return dragHandler;
    }

    // handle the coming and going of pieces
    pieces.addItemAddedListener( function( addedPiece ) {
        // TODO: generalize to other shapes
        var pieceNode = new BeakerNode( denominatorProperty, segmentProperty, {
          beakerWidth: IntroConstants.BEAKER_WIDTH,
          beakerHeight: IntroConstants.BEAKER_LENGTH,
          tickWidth: 3
        } );

        addedPiece.positionProperty.link( function( position ) {
          pieceNode.center = position;
        } );
        piecesNode.addChild( pieceNode );

        addedPiece.returnToOriginEmitter.addListener( function() {
          piecesNode.removeChild( pieceNode );
        } );

        pieces.addItemRemovedListener( function removalListener( removedPiece ) {
          if ( removedPiece === addedPiece ) {
            self.removeChild( pieceNode );

            //  TODO: we need a dispose function on PieceNode
            pieces.removeItemRemovedListener( removalListener );
          }
        } );
      }
    );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );
  return inherit( Node, BucketNode, {} );
} )
;
