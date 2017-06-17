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
  function ProtoSceneView( model ) {
    // @private
    this.model = model;

    // @private {Node}
    this.containerLayer = new HBox( {
      spacing: 10
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
    this.pieceRemovedListener = this.onPieceRemoved.bind( this );

    model.containers.addItemAddedListener( this.addListener );
    model.containers.addItemRemovedListener( this.removeListener );
    model.pieces.addItemAddedListener( this.pieceAddedListener );
    model.pieces.addItemRemovedListener( this.pieceRemovedListener );

    // Initial setup
    model.containers.forEach( this.addListener );

    // @private
    this.bucket = new Rectangle( {
      rectWidth: 300,
      rectHeight: 100,
      centerX: 0,
      centerY: 100,
      fill: 'rgb(200,200,200)',
      stroke: 'black'
    } );
    var bucketLabel = new Text( 'Definitely a bucket', {
      font: new PhetFont( 30 ),
      center: this.bucket.localBounds.center,
      pickable: false
    } );
    this.bucket.addChild( bucketLabel );

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

  fractionsIntro.register( 'ProtoSceneView', ProtoSceneView );

  return inherit( Node, ProtoSceneView, {
    step: function( dt ) {
      _.each( this.pieceNodes.slice(), function( pieceNode ) {
        pieceNode.step( dt );
      } );
    },

    onPieceAdded: function( piece ) {
      var self = this;

      //TODO: support on all
      if ( this.createPieceNode ) {
        var pieceNode = this.createPieceNode( piece, function() {
          self.model.completePiece( piece );
        } );

        var destinationCell = piece.destinationCellProperty.value;
        if ( destinationCell ) {
          var containerNode = _.find( this.containerNodes, function( containerNode ) {
            return containerNode.container === destinationCell.container;
          } );
          //TODO: proper coordinate transform
          var matrix = containerNode.getUniqueTrail().getMatrixTo( self.pieceLayer.getUniqueTrail() );
          pieceNode.destinationProperty.value = matrix.timesVector2( containerNode.getCenterByIndex( destinationCell.index ) );
        }
        else {
          pieceNode.destinationProperty.value = this.bucket.centerTop;
        }

        // TODO: how to set other origins properly
        pieceNode.originProperty.value = this.bucket.centerTop;

        this.pieceNodes.push( pieceNode );
        this.pieceLayer.addChild( pieceNode );
      }
      else {
        this.model.completePiece( piece );
      }
    },

    onPieceRemoved: function( piece ) {
      //TODO: support on all
      if ( this.createPieceNode ) {
        var pieceNode = _.find( this.pieceNodes, function( pieceNode ) {
          return pieceNode.piece === piece;
        } );
        arrayRemove( this.pieceNodes, pieceNode );
        this.pieceLayer.removeChild( pieceNode );
      }
    },

    createContainerNode: function( container ) {
      throw new Error( 'abstract method' );
    },

    addContainer: function( container ) {
      var containerNode = this.createContainerNode( container );

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
      this.model.pieces.removeItemRemovedListener( this.pieceRemovedListener );

      Node.prototype.dispose.call( this );
    }
  } );
} );
