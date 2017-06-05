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
  var ContainerSet = require( 'FRACTIONS_INTRO/intro/model/ContainerSet' );
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalBarNode = require( 'FRACTIONS_INTRO/intro/view/VerticalBarNode' );

  //constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var PIECE_OFFSET_POSITIONS = [
    // Offsets used for initial position of pieces, relative to bucket hole center. Empirically determined.
    new Vector2( -80, -4 ),
    new Vector2( -45, -5 ),
    new Vector2( 80, -5 ),
    new Vector2( -20, -9 ),
    new Vector2( 10, -3 ),
    new Vector2( 35, -5 )
  ];

  /**
   * @param {IntroModel} introModel
   * @param {ObservableArray.<Piece>} pieces
   * @param {Property.<number>} representationProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} segmentProperty
   * @param {object} [options]
   * @constructor
   */
  function BucketNode( introModel, pieces, representationProperty, denominatorProperty, segmentProperty, options ) {

    options = _.extend( {
      bucketPosition: new Vector2( 570, 497 ),
      bucketSize: new Dimension2( 355, 125 )
    }, options );

    Node.call( this, options );

    var self = this;

    this.pieces = pieces;
    this.denominatorProperty = denominatorProperty;
    this.segmentProperty = segmentProperty;
    this.introModel = introModel;
    this.containerSet = new ContainerSet( new NumberProperty( 1 ), this.denominatorProperty, new NumberProperty( 1 ) );

    // Bucket model to be filled with piece
    var bucket = new Bucket( {
      position: options.bucketPosition,
      baseColor: '#8eb7f2',
      size: options.bucketSize,
      invertY: true
    } );

    // creates bucket front
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );

    // creates hole of bucket
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );

    // creates a white rectangle beneath the bucket to prevent slices to appear below the bucket
    var underneathRectangle = new Rectangle( 0, 0, bucketFront.width * 0.8, 150, 0, 0, {
      fill: 'white',
      centerX: bucketHole.centerX,
      top: bucketFront.bottom - 30
    } );
    // node to collect all pieces in the bucket
    var piecesNode = new Node();

    representationProperty.link( function( representation ) {

      var contentPieces;
      // TODO: change from switch to if to prevent copy paste of code
      switch( representation ) {

        case Representation.BEAKER:

          var beakerOptions = {
            beakerWidth: IntroConstants.BEAKER_WIDTH,
            beakerHeight: IntroConstants.BEAKER_LENGTH,
            tickWidth: 3
          };
          contentPieces = self.createContentPieces( representation, bucketHole.center,
            beakerOptions );

          piecesNode.setChildren( contentPieces );

          var beakerIconOptions = {
            beakerWidth: IntroConstants.BEAKER_WIDTH / 4,
            beakerHeight: IntroConstants.BEAKER_LENGTH / 4,
            tickWidth: 1
          };
          bucketFront.setLabel( self.createLabelBox( representation, beakerIconOptions ) );

          options.children = [ bucketHole, piecesNode, underneathRectangle, bucketFront ];
          break;

        case Representation.CAKE:

          var cakeOptions = {
            visibleBackground: false,
            isDraggable: false
          };

          contentPieces = self.createContentPieces( representation, bucketHole.center,
            cakeOptions );

          piecesNode.setChildren( contentPieces );

          var cakeIconOptions = {
            imageHeight: 40,
            isDraggable: false
          };
          bucketFront.setLabel( self.createLabelBox( representation, cakeIconOptions ) );

          options.children = [ bucketHole, piecesNode, underneathRectangle, bucketFront ];
          break;

        case Representation.VERTICAL_BAR:

          contentPieces = self.createContentPieces( representation, bucketHole.center );
          piecesNode.setChildren( contentPieces );

          var verticalBarIconOptions = {
            containerWidth: 30,
            containerHeight: 60,
            outlineLineWidth: 1
          };

          // set the label on the bucket
          bucketFront.setLabel( self.createLabelBox( representation, verticalBarIconOptions ) );
          options.children = [ bucketHole, piecesNode, underneathRectangle, bucketFront ];
          break;

        case Representation.NUMBER_LINE :
          options.children = [];
          break;

        default:
          // TODO: temporary  remove when done

          bucketFront.setLabel();
          options.children = [ underneathRectangle, bucketHole, bucketFront ];
          break;
      }

      self.mutate( options );
    } );

    // handle the coming and going of pieces
    pieces.addItemAddedListener( function( addedPiece ) {


      // TODO: clean up handling of options
      var options = {};

      if ( representationProperty.value === Representation.BEAKER ) {

        options = {
          beakerWidth: IntroConstants.BEAKER_WIDTH,
          beakerHeight: IntroConstants.BEAKER_LENGTH,
          tickWidth: 3
        };
      }
      if ( representationProperty.value === Representation.CAKE ) {
        options = {
          visibleBackground: false
        };
      }

      var pieceNode = self.createRepresentation( representationProperty.value, options );

      addedPiece.positionProperty.link( function( position ) {
        pieceNode.center = position;
      } );
      piecesNode.addChild( pieceNode );

      addedPiece.reachedDestinationEmitter.addListener( function removeAddedPiece() {
        pieces.remove( addedPiece );
      } );

      pieces.addItemRemovedListener( function removalListener( removedPiece ) {
        if ( removedPiece === addedPiece ) {
          piecesNode.removeChild( pieceNode );

          //  TODO: we need a dispose function on PieceNode
          pieces.removeItemRemovedListener( removalListener );
        }
      } );
    } );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );
  return inherit( Node, BucketNode, {
    /**
     * @param {Representation} representation
     * @param {Object} [options]
     * @returns {HBox}
     * @private
     */
    createRepresentation: function( representation, options ) {

      switch( representation ) {

        case Representation.VERTICAL_BAR:

          var verticalBarNode = new VerticalBarNode( this.containerSet, this.pieces, options );
          return verticalBarNode.createVerticalBarPiece( this.denominatorProperty );

        case Representation.BEAKER:

          // creates beaker icon on bucket node
          var beakerNode = new BeakerNode( this.denominatorProperty, this.segmentProperty, options );
          return beakerNode;

        case Representation.CAKE:

          // creating cake
          var cakeNode = new CakeNode( this.containerSet, options );
          return cakeNode;

        default:
          throw new Error( 'Unknown Representation: ' + representation );
      }

    },

    /**
     * creates an HBox with an icon and a fraction
     * @param {Representation} representation
     * @returns {HBox}
     * @private
     */
    createLabelBox: function( representation, options ) {

      // create the fraction with a numerator of 1
      var fractionNode = new FractionNode(
        new NumberProperty( 1 ),
        this.denominatorProperty, {
          font: new PhetFont( { size: 22 } ),
          dividingLineLength: 25,
          dividingLineWidth: 2
        } );

      // create the appropriate icon
      var iconNode = this.createRepresentation( representation, options );

      return new HBox( {
        align: 'center',
        spacing: 20,
        children: [ iconNode, fractionNode ]
      } );
    },

    /**
     * create a drag handler that adds a piece to the model
     * @param {Vector2} centerPosition - centerPosition of the shape
     * @returns {SimpleDragHandler}
     * @private
     */
    createDragHandler: function( centerPosition ) {
      var piece = null;
      var self = this;
      var dragHandler = new SimpleDragHandler( {

        allowTouchSnag: true,

        start: function() {

          // create a model piece
          piece = new Piece( {
            position: centerPosition,
            dragging: true
          } );

          // add the model piece to the observable array
          self.pieces.add( piece );
        },

        translate: function( translationParams ) {
          piece.positionProperty.value = piece.positionProperty.value.plus( translationParams.delta );
        },

        end: function() {

          if ( self.introModel.containerSet.getEmptyCellsCount() > 0 ) {
            var destinationCell = self.introModel.containerSet.getClosestEmptyCell( piece.positionProperty.value );
            piece.animateToCell( destinationCell );
          }
          else {
            piece.animateToBucket( piece.positionProperty.initialValue );
          }
          piece = null;
        }
      } );

      return dragHandler;
    },
    /**
     * create an array of pieces for the bucket
     *
     * @param {Representation} representation
     * @param {Vector2} bucketHoleCenter
     * @param {Object} [options]
     * @returns {Node[]} contentPieces
     * @private
     */
    createContentPieces: function( representation, bucketHoleCenter, options ) {

      var self = this;
      // create all pieces for the bucket
      var contentPieces = PIECE_OFFSET_POSITIONS.map( function( position ) {
        var centerPosition = position.plus( bucketHoleCenter ).plus( new Vector2( 0, 15 ) );

        var representationNode = self.createRepresentation( representation, options );

        representationNode.center = centerPosition;

        representationNode.addInputListener( self.createDragHandler( centerPosition ) );

        return representationNode;

      } );
      return contentPieces;
    }
  } );
} );
