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
  var BeakerContainerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerContainerNode' );
  var BeakerPieceNode = require( 'FRACTIONS_INTRO/intro/view/BeakerPieceNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BucketNode = require( 'FRACTIONS_INTRO/intro/view/BucketNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: reduce with RectangularView?
   *
   * @param {IntroModel} model
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
    this.bucketNode = new BucketNode(  model.denominatorProperty );

    this.bucketNode.addInputListener( {
      down: function( event ) {
        self.startBeakerDrag( event );
      }
    } );

    Node.call( this, {
      children: [
        this.bucketNode,
        new AlignBox( this.containerLayer, {
          alignBounds: Bounds2.point( 0, -150 )
        } ),
        this.pieceLayer
      ]
    } );
  }

  fractionsIntro.register( 'BeakerView', BeakerView );

  return inherit( Node, BeakerView, {
    /**
     *
     * @param {number} dt - time step in seconds
     * @public
     */
    step: function( dt ) {
      _.each( this.pieceNodes.slice(), function( pieceNode ) {
        if ( !pieceNode.isUserControlled ) {
          pieceNode.step( dt );
        }
      } );
    },

    /**
     * @private
     */
    onClearChange: function() {
      this.pieceLayer.interruptSubtreeInput();
      this.pieceLayer.removeAllChildren();
      this.pieceNodes = [];
    },

    /**
     *
     * @param {Piece} piece
     * @private
     */
    onPieceAdded: function( piece ) {
      this.model.completePiece( piece ); // don't animate pieces
    },

    /**
     *
     * @param {BeakerPieceNode} pieceNode
     * @private
     */
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
        pieceNode.destinationProperty.value = this.bucketNode.centerTop;
        pieceNode.isUserControlled = false;
      }
    },

    /**
     *
     * @param {Event} event
     * @private
     */
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

    /**
     *
     * @param {Container} container
     * @param {Event} event
     * @private
     */
    onExistingCellDragStart: function( container, event ) {
      this.model.changeNumeratorManually( -1 );
      container.getNextFilledCell().empty();
      this.startBeakerDrag( event );
    },

    /**
     *
     * @param {Container} container
     * @private
     */
    addContainer: function( container ) {
      var self = this;

      var containerNode = new BeakerContainerNode( container, function( event ) {
        self.onExistingCellDragStart( container, event );
      } );

      this.containerNodes.push( containerNode );
      this.containerLayer.addChild( containerNode );
    },
    /**
     *
     * @param {Container} container
     * @private
     */
    removeContainer: function( container ) {
      var containerNode = _.find( this.containerNodes, function( containerNode ) {
        return containerNode.container === container;
      } );

      this.containerLayer.removeChild( containerNode );
      arrayRemove( this.containerNodes, containerNode );

      containerNode.dispose();
    },
    /**
     * @public
     */
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
