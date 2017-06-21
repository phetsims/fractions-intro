// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var BeakerContainerNode = require( 'FRACTIONS_INTRO/proto/view/BeakerContainerNode' );
  var BeakerPieceNode = require( 'FRACTIONS_INTRO/proto/view/BeakerPieceNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * TODO: reduce with RectangularView?
   *
   * @param {ProtoModel} model
   */
  function BeakerView( model ) {

    var self = this;

    // @private
    this.model = model;

    // @private {Node}
    this.containerLayer = new HBox( {
      spacing: 35
    } );

    // @private {Node}
    this.pieceLayer = new Node();

    // @private {Array.<CircularContainerNode>}
    this.containerNodes = [];

    // @private {Array.<*>} TODO improve doc type
    this.pieceNodes = [];

    // @private {function}
    this.addListener = this.addContainer.bind( this );
    this.removeListener = this.removeContainer.bind( this );
    this.pieceAddedListener = this.onPieceAdded.bind( this );
    this.clearListener = this.onClearChange.bind( this );

    model.containers.addItemAddedListener( this.addListener );
    model.containers.addItemRemovedListener( this.removeListener );
    model.pieces.addItemAddedListener( this.pieceAddedListener );
    model.denominatorProperty.lazyLink( this.clearListener );
    model.maxProperty.lazyLink( this.clearListener );

    // Initial setup
    model.containers.forEach( this.addListener );

    // @private
    this.bucket = new Rectangle( {
      rectWidth: 300,
      rectHeight: 100,
      centerX: 0,
      centerY: 100,
      fill: 'rgb(200,200,200)',
      stroke: 'black',
      cursor: 'pointer'
    } );
    var bucketLabel = new Text( 'Definitely a bucket', {
      font: new PhetFont( 30 ),
      center: this.bucket.localBounds.center,
      pickable: false
    } );
    this.bucket.addChild( bucketLabel );
    this.bucket.addInputListener( {
      down: function( event ) {
        self.startBeakerDrag( event );
      }
    } );

    Node.call( this, {
      children: [
        this.bucket,
        new AlignBox( this.containerLayer, {
          alignBounds: Bounds2.point( 0, -150 )
        } ),
        this.pieceLayer
      ]
    } );
  }

  fractionsIntro.register( 'BeakerView', BeakerView );

  return inherit( Node, BeakerView, {
    step: function( dt ) {
      _.each( this.pieceNodes.slice(), function( pieceNode ) {
        if ( !pieceNode.isUserControlled ) {
          pieceNode.step( dt );
        }
      } );
    },

    onClearChange: function() {
      this.pieceLayer.interruptSubtreeInput();
      this.pieceLayer.removeAllChildren();
      this.pieceNodes = [];
    },

    onPieceAdded: function( piece ) {
      this.model.completePiece( piece ); // don't animate pieces
    },

    onBeakerDropped: function( pieceNode ) {
      var self = this;

      var closestContainer = null;
      var closestDistance = 150;

      _.each( this.containerNodes, function( containerNode ) {
        var matrix = containerNode.getUniqueTrail().getMatrixTo( self.pieceLayer.getUniqueTrail() );
        var position = matrix.timesVector2( containerNode.localBounds.center );
        var distance = pieceNode.center.distance( position );
        var container = containerNode.container;

        if ( distance < closestDistance && container.getNextEmptyCell() ) {
          closestContainer = containerNode.container;
          closestDistance = distance;
        }
      } );

      if ( closestContainer ) {
        this.model.changeNumeratorManually( 1 );
        closestContainer.getNextEmptyCell().fill();

        arrayRemove( this.pieceNodes, pieceNode );
        this.pieceLayer.removeChild( pieceNode );
      }
      else {
        pieceNode.originProperty.value = pieceNode.center;
        pieceNode.destinationProperty.value = this.bucket.centerTop;
        pieceNode.isUserControlled = false;
      }
    },

    startBeakerDrag: function( event ) {
      var self = this;

      var pieceNode = new BeakerPieceNode( this.model.denominatorProperty.value, function( pieceNode ) {
        arrayRemove( self.pieceNodes, pieceNode );
        self.pieceLayer.removeChild( pieceNode );
        pieceNode.dispose();
      }, this.onBeakerDropped.bind( this ) );
      this.pieceNodes.push( pieceNode );
      this.pieceLayer.addChild( pieceNode );

      pieceNode.isUserControlled = true;
      pieceNode.center = pieceNode.globalToParentPoint( event.pointer.point );
      pieceNode.dragListener.startDrag( event );
    },

    onExistingCellDragStart: function( container, event ) {
      this.model.changeNumeratorManually( -1 );
      container.getNextFilledCell().empty();
      this.startBeakerDrag( event );
    },

    addContainer: function( container ) {
      var self = this;

      var containerNode = new BeakerContainerNode( container, function( event ) {
        self.onExistingCellDragStart( container, event );
      } );

      this.containerNodes.push( containerNode );
      this.containerLayer.addChild( containerNode );
    },
    removeContainer: function( container ) {
      var containerNode = _.find( this.containerNodes, function( containerNode ) {
        return containerNode.container === container;
      } );

      this.containerLayer.removeChild( containerNode );
      arrayRemove( this.containerNodes, containerNode );

      containerNode.dispose();
    },
    dispose: function() {
      _.each( this.containerNodes, function( containerNode ) {
        containerNode.dispose();
      } );

      this.model.containers.removeItemAddedListener( this.addListener );
      this.model.containers.removeItemRemovedListener( this.removeListener );
      this.model.pieces.removeItemAddedListener( this.pieceAddedListener );
      this.model.denominatorProperty.unlink( this.clearListener );
      this.model.maxProperty.unlink( this.clearListener );

      Node.prototype.dispose.call( this );
    }
  } );
} );
