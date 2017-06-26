// Copyright 2017, University of Colorado Boulder

/**
 * create a cell with listener for display on the screen inside the bucket and containers
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var BucketNode = require( 'FRACTIONS_INTRO/intro/view/BucketNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  function CellSceneView( model, options ) {

    options = _.extend( {
      containerLayerVerticalAlignment: false,
      maxnumberofHorizontalContainers: IntroConstants.MAX_RANGE.max //default max Range
    }, options );

    // @private {number}
    this.maxnumberofHorizontalContainers = options.maxnumberofHorizontalContainers;

    // @private {boolean}
    this.containerLayerVerticalAlignment = options.containerLayerVerticalAlignment;

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

    //@private {Array.<*>}
    this.HBoxes = [];

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

    this.bucketNode = new BucketNode( model.denominatorProperty, this.pieceLayer, this.onBucketDragStart.bind( this )
      , this.createCellNode.bind( this ) );

    Node.call( this, {
      children: [
        new AlignBox( this.containerLayer, {
          alignBounds: Bounds2.point( 0, -150 )
        } ),
        this.bucketNode
      ]
    } );
  }

  fractionsIntro.register( 'CellSceneView', CellSceneView );

  return inherit( Node, CellSceneView, {
    /**
     *
     * @param {number} dt - time step
     * @public
     */
    step: function( dt ) {
      var self = this;

      _.each( this.pieceNodes.slice(), function( pieceNode ) {
        pieceNode.step( dt );

        if ( pieceNode.isUserControlled ) {
          var closestCell = self.getClosestCell( pieceNode.getMidpoint() );
          if ( closestCell ) {
            pieceNode.orient( closestCell, dt );
          }
        }
      } );
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
     *
     * @param {Piece} piece
     * @private
     */
    onPieceAdded: function( piece ) {
      var self = this;

      //TODO: support on all
      if ( this.createPieceNode ) {
        var pieceNode = this.createPieceNode( piece, function() {
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

        var originCell = piece.originCellProperty.value;
        if ( originCell ) {
          pieceNode.originProperty.value = this.getCellMidpoint( originCell );
        }
        else {
          pieceNode.originProperty.value = this.bucketNode.position;
        }

        var destinationCell = piece.destinationCellProperty.value;
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
        this.model.completePiece( piece );
      }
    },

    /**
     *
     * @param {Piece} piece
     * @private
     */
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

    /**
     * callback on start event when grabbing piece from bucketNode
     * @param {Event} event
     * @private
     */
    onBucketDragStart: function( event ) {
      var piece = this.model.grabFromBucket();
      var pieceNode = _.find( this.pieceNodes, function( pieceNode ) {
        return pieceNode.piece === piece;
      } );

      pieceNode.originProperty.value = this.globalToLocalPoint( event.pointer.point );
      pieceNode.isUserControlled = true;
      pieceNode.dragListener.startDrag( event );
    },

    /**
     *
     * @param {Cell} cell
     * @param {Event} event
     * @private
     */
    onExistingCellDragStart: function( cell, event ) {
      var piece = this.model.grabCell( cell );
      var pieceNode = _.find( this.pieceNodes, function( pieceNode ) {
        return pieceNode.piece === piece;
      } );

      pieceNode.originProperty.value = this.getCellMidpoint( cell );
      pieceNode.isUserControlled = true;
      pieceNode.dragListener.startDrag( event );
    },

    /**
     * This function should be overridden by the parent method
     * @param {Container} container
     * @param {Function} cellDownCallback
     * @private
     */
    createContainerNode: function( container, cellDownCallback ) {
      throw new Error( 'abstract method' );
    },

    /**
     * add a container node to the scene graph
     * @param {Container} container
     * @private
     */
    addContainer: function( container ) {

      var containerNode = this.createContainerNode( container, this.onExistingCellDragStart.bind( this ) );

      var currentContainerNodesLength = this.containerNodes.length;

      this.containerNodes.push( containerNode );

      this.containerLayer.addChild(containerNode);

      if (this.containerLayerVerticalAlignment) {
        // creates new Hbox within containerLayer VBox dependent on
        if ( currentContainerNodesLength % this.maxnumberofHorizontalContainers === 0 ) {
          var HBoxContainer = new VBox( {
            spacing: 10
          } );
          this.HBoxes.push( HBoxContainer );
          this.containerLayer.addChild( HBoxContainer );
        }
        this.HBoxes[ this.HBoxes.length - 1 ].addChild( containerNode );
      }
    },

    /**
     * remove a container node from the scene graph
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
      this.model.pieces.removeItemRemovedListener( this.pieceRemovedListener );

      Node.prototype.dispose.call( this );
    }
  } );
} );
