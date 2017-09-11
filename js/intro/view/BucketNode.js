// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for displaying bucketNode and pieces in bucketNode slice in fractions-intro
 * @author Vincent Davis (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var CakeContainerNode = require( 'FRACTIONS_INTRO/intro/view/CakeContainerNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CircularContainerNode = require( 'FRACTIONS_INTRO/intro/view/CircularContainerNode' );
  var Container = require( 'FRACTIONS_INTRO/intro/model/Container' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularContainerNode = require( 'FRACTIONS_INTRO/intro/view/RectangularContainerNode' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();

  var PIECE_OFFSET_POSITIONS = [

    // Offsets used for initial position of pieces, relative to bucket hole center. Empirically determined.
    new Vector2( 90, 4 ),
    new Vector2( -85, 5 ),
    new Vector2( -40, 9 ),
    new Vector2( 0, 0 ),
    new Vector2( 37, 7 ),
    new Vector2( 75, 5 ),
    new Vector2( 90, 5 )
  ];

  /**
   * @param {Property.<number>} denominatorProperty
   * @param {Node} pieceLayer
   * @param {function} startPieceDrag
   * @param {function} createCellNode
   * @param {Property.<Representation>} representationProperty
   * @param {Object} [options]
   * @constructor
   */
  function BucketNode( denominatorProperty, pieceLayer, startPieceDrag, createCellNode, representationProperty, options ) {

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

    // creates icon Container
    var iconContainer = new Container();

    // fills one cell according to denominator property
    iconContainer.addCells( denominatorProperty.value );
    iconContainer.cells.get( 0 ).fill();

    // creates icon specific to representationProperty
    switch( representationProperty.value ) {
      case Representation.CIRCLE:
        var bucketIcon = new CircularContainerNode( iconContainer, function() {}, {
          isIcon: true
        } );
        var bucketIconBackground = new Circle( bucketIcon.radius, { fill: 'white', center: bucketIcon.center } );
        break;
      case Representation.HORIZONTAL_BAR:
        bucketIcon = new RectangularContainerNode( iconContainer, function() {}, {
          rectangleOrientation: 'horizontal',
          isIcon: true
        } );
        bucketIconBackground = new Rectangle( 0, 0, bucketIcon.width, bucketIcon.height, 0, 0, {
          fill: 'white',
          center: bucketIcon.center
        } );
        PIECE_OFFSET_POSITIONS = [

          // Offsets used for initial position of pieces, relative to bucket hole center. Empirically determined.
          new Vector2( -12, 9 ),
          new Vector2( 0, 0 ),
          new Vector2( 12, 7 )
        ];
        break;
      case Representation.VERTICAL_BAR:
        bucketIcon = new RectangularContainerNode( iconContainer, function() {}, {
          rectangleOrientation: 'vertical',
          isIcon: true
        } );
        bucketIconBackground = new Rectangle( 0, 0, bucketIcon.width, bucketIcon.height, 0, 0, {
          fill: 'white',
          center: bucketIcon.center
        } );
        PIECE_OFFSET_POSITIONS = [

          // Offsets used for initial position of pieces, relative to bucket hole center. Empirically determined.
          new Vector2( -70, 5 ),
          new Vector2( -40, 9 ),
          new Vector2( 0, 0 ),
          new Vector2( 37, 7 ),
          new Vector2( 75, 5 )
        ];
        break;
      case Representation.CAKE:
        bucketIcon = new CakeContainerNode( iconContainer, function() {}, {
          maxHeight: 50
        } );
        bucketIconBackground = new Node();
        break;
      case Representation.BEAKER:
        bucketIcon = new BeakerNode( 1, denominatorProperty.value, {
          fullHeight: IntroConstants.BEAKER_HEIGHT / 4,
          xRadius: 10,
          yRadius: 3,
          tickWidth: 1
        } );
        bucketIconBackground = new Node();
        break;
      default:
        throw new Error( 'Unknown representation: ' + representationProperty.value );
    }

    // layer to hold all the static cell nodes in the bucket
    var staticLayer = new Node();

    denominatorProperty.link( function( denominator ) {
      // take denominator, and the length of the icon container
      // find the difference add/remove that many cells from the container
      var difference = denominator - iconContainer.cells.length;
      if ( difference > 0 ) {

        //add cells
        iconContainer.addCells( difference );
      }
      else if ( difference < 0 ) {

        //remove cells
        iconContainer.removeCells( -difference );
      }

      staticLayer.removeAllChildren();

      // places pieces in bucket dependent on defined vectors
      PIECE_OFFSET_POSITIONS.forEach( function( position ) {
        var staticCellNode = createCellNode( denominator, 0, { center: position.plus( bucketHole.center ) } );
        staticLayer.addChild( staticCellNode );
      } );
    } );

    // mathematical fraction 1/Denominator
    var fractionIconNode = new FractionNode( new NumberProperty( 1 ), denominatorProperty, {
      font: new PhetFont( 20 ),
      dividingLineLength: 15,
      dividingLineWidth: 2
    } );

    // arrange bucketIcon and background into one node
    var bucketIconNode = new Node( { children: [ bucketIconBackground, bucketIcon ] } );

    var label = new HBox( {
      align: 'center',
      spacing: 20,
      children: [ bucketIconNode, fractionIconNode ]
    } );

    bucketFront.setLabel( label );

    options.children = [ bucketHole, staticLayer, pieceLayer, underneathRectangle, bucketFront ];
    Node.call( this, options );

    // add listener to the bucket and static pieces
    [ bucketHole, staticLayer, bucketFront ].forEach( function( node ) {
      node.addInputListener( {
        down: function( event ) {
          startPieceDrag( event );
        }
      } );
    } );
  }

  fractionsIntro.register( 'BucketNode', BucketNode );

  return inherit( Node, BucketNode );
} );
