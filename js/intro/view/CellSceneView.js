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
  var Bounds2 = require( 'DOT/Bounds2' );
  var BucketNode = require( 'FRACTIONS_INTRO/intro/view/BucketNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
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
      maxHorizontalContainers: IntroConstants.MAX_RANGE.max, //default max Range
      horizontalSpacing: 10, // horizontal spacing between adjacent containers
      verticalSpacing: 10, // vertical spacing  between containers
      verticalOffset: 0
    }, options );

    // @private
    this.options = options;

    // @private
    this.model = model;

    // @private {VBox}
    this.containerLayer = new VBox( {
      spacing: options.verticalSpacing,

      // left align containerHBoxes
      align: 'left'
    } );

    // @private {Node}
    this.pieceLayer = new Node();

    // @private {Array.<*>}
    this.containerNodes = [];

    // @private {Array.<*>} TODO improve doc type
    this.pieceNodes = [];

    //@private {Array.<HBox>}
    this.containerHBoxes = [];

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
    this.bucketNode = new BucketNode( model.denominatorProperty, this.pieceLayer, this.onBucketDragStart.bind( this )
      , this.createCellNode.bind( this ), model.representationProperty );

    Node.call( this, {
      children: [
        new AlignBox( this.containerLayer, {
          alignBounds: Bounds2.point( 0, options.verticalOffset ),

          // aligns the containerNodes with respect to the top
          yAlign: 'top'
        } ),
        this.bucketNode
      ]
    } );
  }

  fractionsIntro.register( 'CellSceneView', CellSceneView );

  return inherit( Node, CellSceneView, {
    /**
     * Steps forward in time.
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
     * callback whenever a piece is added
     * @param {Piece} piece
     * @private
     */
    onPieceAdded: function( piece ) {
      var self = this;

      //TODO: support on all
      if ( this.createPieceNode ) {
        var pieceNode = this.createPieceNode( piece,
          function() {
            self.model.completePiece( piece );
          },
          function() {
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
        this.model.completePiece( piece );
      }
    },

    /**
     * callback whenever a piece is remove
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
     * Handles when a user drags a cell from a displayed container.
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

      // creates new HBox within containerLayer dependent on VBox container
      if ( currentContainerNodesLength % this.options.maxHorizontalContainers === 0 ) {
        var containerHBox = new HBox( {
          spacing: this.options.horizontalSpacing,
          align: 'top'
        } );
        this.containerHBoxes.push( containerHBox );
        this.containerLayer.addChild( containerHBox );
      }

      // adds the new containerNode at the end of containerHboxes array
      this.containerHBoxes[ this.containerHBoxes.length - 1 ].addChild( containerNode );

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

      arrayRemove( this.containerNodes, containerNode );

      // removes the last containerNode within the containerHBox Array
      this.containerHBoxes[ this.containerHBoxes.length - 1 ].removeChild( containerNode );

      var currentContainerLength = this.containerNodes.length;
      if ( currentContainerLength % this.options.maxHorizontalContainers === 0 ) {

        // removes the last HBox within containerLayer
        var containerHBoxRemoved = this.containerHBoxes.pop();
        this.containerLayer.removeChild( containerHBoxRemoved );
      }

      containerNode.dispose();
    },

    /**
     * dispose of the links for garbage collection
     *
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
