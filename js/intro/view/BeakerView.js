// Copyright 2017, University of Colorado Boulder

/**
 * Node for displaying beakers on the screen
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
  var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
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
    this.pieceRemovedListener = this.onPieceRemoved.bind( this );
    this.clearListener = this.onClearChange.bind( this );

    model.containers.addItemAddedListener( this.addListener );
    model.containers.addItemRemovedListener( this.removeListener );
    model.pieces.addItemAddedListener( this.pieceAddedListener );
    model.pieces.addItemRemovedListener( this.pieceRemovedListener );
    model.denominatorProperty.lazyLink( this.clearListener );
    model.maxProperty.lazyLink( this.clearListener );

    // Initial setup
    model.containers.forEach( this.addListener );

    // @private
    this.bucketNode = new BucketNode( model.denominatorProperty, this.pieceLayer, this.startBeakerDrag.bind( this ),
      this.createBeakerNode.bind( this ), model.representationProperty );

    Node.call( this, {
      children: [
        new AlignBox( this.containerLayer, {
          alignBounds: Bounds2.point( 0, 10 ),

          // aligns the containerNodes with respect to the top
          yAlign: 'top'
        } ),
        this.bucketNode
      ]
    } );
  }

  fractionsIntro.register( 'BeakerView', BeakerView );

  return inherit( Node, BeakerView, {
    /**
     * Steps forward in time.
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
     * returns the closest cell
     * @param {Vector2} midpoint
     * @param {number} [threshold]
     * @returns {Cell}
     */
    getClosestCell: function( midpoint, threshold ) {
      var self = this;

      var closestCell = null;
      var closestDistance = (threshold === undefined) ? Number.POSITIVE_INFINITY : 100;
      this.model.containers.forEach( function( container ) {
        container.cells.forEach( function( cell ) {
          if ( !cell.isFilledProperty.value ) {
            var cellMidpoint = self.getCellMidpoint( cell );
            var distance = cellMidpoint.distance( midpoint );
            if ( distance < closestDistance ) {
              closestDistance = distance;
              closestCell = cell;
            }
          }
        } );
      } );
      return closestCell;
    },

    /**
     * returns the midpoint associated with the cell
     * @param {Cell} cell
     * @returns {Vector2}
     * @public
     */
    getCellMidpoint: function( cell ) {
      var containerNode = _.find( this.containerNodes, function( containerNode ) {
        return containerNode.container === cell.container;
      } );
      //TODO: proper coordinate transform
      var matrix = containerNode.getUniqueTrail().getMatrixTo( this.pieceLayer.getUniqueTrail() );
      return matrix.timesVector2( containerNode.getMidpointByIndex( cell.index ) );
    },

    /**
     * callback whenever a piece is added
     *
     * @param {Piece} piece
     * @private
     */
    onPieceAdded: function( piece ) {
      var self = this;

      //TODO: support on all
      if ( this.createPieceNode ) {
        var pieceNode = this.createPieceNode( self.model.denominatorProperty.value, function() {
          self.model.completePiece( piece );
        }, function() {
          var currentMidpoint = pieceNode.getMidpoint();

          var closestCell = self.getClosestCell( currentMidpoint, 100 );

          pieceNode.isUserControlled = false;
          pieceNode.originProperty.value = currentMidpoint;

          if ( closestCell ) {
            pieceNode.destinationProperty.value = self.getCellMidpoint( closestCell );
            self.model.targetPieceToCell( piece, closestCell );
          }
          else {
            pieceNode.destinationProperty.value = self.bucketNode.position;
          }
        } );

        pieceNode.piece = piece;

        var originCell = piece.originCell;
        if ( originCell ) {
          pieceNode.originProperty.value = this.getCellMidpoint( originCell );
        }
        else {
          pieceNode.originProperty.value = this.bucketNode.position;
        }

        var destinationCell = piece.destinationCell;
        if ( destinationCell ) {
          pieceNode.destinationProperty.value = this.getCellMidpoint( destinationCell );
        }
        else {
          pieceNode.destinationProperty.value = this.bucketNode.position;
        }

        this.pieceNodes.push( pieceNode );
        this.pieceLayer.addChild( pieceNode );
      }
      else {
        this.model.completePiece( piece ); // don't animate piece
      }
    },

    /**
     * create a beaker piece node
     * @param {number} denominator
     * @param {Function} finishedAnimatingCallback
     * @param {Function} droppedCallback
     * @returns {BeakerPieceNode}
     * @public
     */
    createPieceNode: function( denominator, finishedAnimatingCallback, droppedCallback ) {
      return new BeakerPieceNode( denominator, finishedAnimatingCallback, droppedCallback );
    },

    /**
     * callback whenever a piece is remove
     *
     * @param {Piece} piece
     * @private
     */
    onPieceRemoved: function( piece ) {

      if ( this.createPieceNode ) {
        var pieceNode = _.find( this.pieceNodes, function( pieceNode ) {
          return pieceNode.piece === piece;
        } );
        arrayRemove( this.pieceNodes, pieceNode );
        this.pieceLayer.removeChild( pieceNode );
      }
    },

    /**
     * handles when a beaker piece is dropped
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

        pieceNode.destinationProperty.value = closestContainer.center;
        arrayRemove( this.pieceNodes, pieceNode );
        this.pieceLayer.removeChild( pieceNode );
      }
      else {
        pieceNode.originProperty.value = pieceNode.center;
        pieceNode.destinationProperty.value = this.bucketNode.position;
        pieceNode.isUserControlled = false;
      }
    },

    /**
     * Called when a beaker piece or cell is dragged
     *
     * @param {Event} event
     * @private
     */
    startBeakerDrag: function( event ) {
      var self = this;
      var piece = this.model.grabFromBucket();
      var pieceNode = this.createPieceNode( this.model.denominatorProperty.value, function( pieceNode ) {
        self.model.completePiece( pieceNode.piece );
      }, this.onBeakerDropped.bind( this ) );
      pieceNode.piece = piece;

      this.pieceNodes.push( pieceNode );
      this.pieceLayer.addChild( pieceNode );

      pieceNode.isUserControlled = true;
      pieceNode.center = pieceNode.globalToParentPoint( event.pointer.point );
      pieceNode.dragListener.startDrag( event );
    },

    /**
     * Handles when a user drags a cell from a displayed container.
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
     * Creates a beaker Node with 1/D
     *
     * @param {number} denominator
     * @param {number} index
     * @param {Object} [options]
     * @returns {BeakerNode}
     * @public
     */
    createBeakerNode: function( denominator, index, options ) {

      // the numerator is set to one
      return new BeakerNode( 1, denominator, options );
    },

    /**
     * adds a container when max is increased
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
     * removes a container when max is decreased
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
     * dispose of the links for garbage collection
     * @public
     */
    dispose: function() {
      _.each( this.containerNodes, function( containerNode ) {
        containerNode.dispose();
      } );

      this.model.containers.removeItemAddedListener( this.addListener );
      this.model.containers.removeItemRemovedListener( this.removeListener );
      this.model.pieces.removeItemAddedListener( this.pieceAddedListener );
      this.model.pieces.removeItemRemovedListener( this.pieceRemovedListener );
      this.model.denominatorProperty.unlink( this.clearListener );
      this.model.maxProperty.unlink( this.clearListener );

      Node.prototype.dispose.call( this );
    }
  } );
} );
