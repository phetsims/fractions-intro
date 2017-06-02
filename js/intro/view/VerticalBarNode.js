// Copyright 2017, University of Colorado Boulder

/**
 * Node for creating vertical rectangle representation in fractions-intro
 * @author Vincent Davis (Berea College)
 * @author Dusty Cole (Berea College)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Piece = require( 'FRACTIONS_INTRO/intro/model/Piece' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // constant
  var CONTAINER_WIDTH = 130;
  var CONTAINER_HEIGHT = 185;

  /**
   *
   * @param {ContainerSet} containerSet
   * @param {ObservableArray.<Pieces>} pieces
   * @param {Object} [options]
   * @constructor
   */
  function VerticalBarNode( containerSet, pieces, options ) {
    options = _.extend( {
        align: 'center',
        containerSpacing: 22,
        containerWidth: 130,
        containerHeight: 185,
        center: new Vector2( 0, 160 ),
        visibleBackground: true,
        outlineLineWidth: 3
      },
      options );

    Node.call( this );

    // @private
    this.pieces = pieces;

    // @private
    this.options = options;

    // @private
    this.containerSet = containerSet;
    var self = this;

    // A HBox to hold the set of containers
    var setOfVerticalBarNodes = new HBox( { align: options.align, spacing: options.containerSpacing } );
    this.addChild( setOfVerticalBarNodes );

    // function for displaying the containers
    function displayContainers() {

      var containersLayer = [];

      // loop over all the containers in the container set
      containerSet.containers.forEach( function( container ) {

        var containerNode = new Node();

        // outline of the container and inner line depend on the filled status of the container
        var containerStroke = container.isContainerEmpty() ? 'grey' : 'black';
        var containerRectangle = new Rectangle( 0, 0, options.containerWidth, options.containerHeight, 0, 0, {
          stroke: containerStroke,
          lineWidth: options.outlineLineWidth
        } );

        var numberOfCells = container.cells.length;
        var cellHeight = options.containerHeight / numberOfCells;

        // an array holder that will hold the cell Rectangles
        var cellsRectangle = [];

        // create the cells for the container
        container.cells.forEach( function( cell, index ) {

          // the fill of the cell depends upon the filled property
          var cellFill = cell.isFilledProperty.value ? '#FFE600' : 'white';

          var cellRectangle = self.createCellRectangle( cellHeight, cellFill, containerStroke, index );
          if ( cell.isFilledProperty.value ) {
            cellRectangle.addInputListener( self.createDragHandler( cellRectangle.center, cell ) );
          }
          cellsRectangle.push( cellRectangle );

        } );

        containerNode.setChildren( cellsRectangle );
        containerNode.addChild( containerRectangle );
        containersLayer.push( containerNode );
      } );

      setOfVerticalBarNodes.setChildren( containersLayer );
      self.center = options.center;
    }

    // needs to be called once or the beginning state of the containers will not be displayed
    displayContainers();

    // add listener to container sets
    containerSet.containersEmitter.addListener( function() {
      displayContainers();
    } );
  }

  fractionsIntro.register( 'VerticalBarNode', VerticalBarNode );

  return inherit( Node, VerticalBarNode, {
    /**
     * create vertical bar pieces to use inside the bucket
     * @param denominatorProperty
     * @returns {Node}
     * @private
     */
    createVerticalBarPiece: function( denominatorProperty ) {

      var containerNode = new Node();

      denominatorProperty.link( function( denominator ) {
        containerNode.removeAllChildren();
        var cellHeight = CONTAINER_HEIGHT / denominator;

        //find the length to minus from each side of the cell to fit in the bucket at all time
        var sizeDiff = CONTAINER_HEIGHT / denominator;
        var sideLengthMinus = (CONTAINER_HEIGHT - sizeDiff) / 2;

        //make one cell
        var cellRectangle = new Rectangle( 0, 0, CONTAINER_WIDTH, cellHeight, 0, 0, {
          fill: '#FFE600',
          lineWidth: 1,
          stroke: 'black',
          top: CONTAINER_HEIGHT - (sideLengthMinus),
          bottom: CONTAINER_HEIGHT - sideLengthMinus
        } );
        containerNode.addChild( cellRectangle );
      } );

      return containerNode;

    },
    /**
     * create a drag handler that adds a piece to the model
     * @param {Vector2} centerPosition - centerPosition of the shape
     * @returns {SimpleDragHandler}
     * @private
     */
    createDragHandler: function( centerPosition, cell ) {
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
          self.containerSet.emptyThisCell( cell );
        },

        translate: function( translationParams ) {
          piece.positionProperty.value = piece.positionProperty.value.plus( translationParams.delta );
        },

        end: function() {
          piece.draggingProperty.set( false );
          piece = null;
        }
      } );

      return dragHandler;
    },
    /**
     * creates a rectangle to be used to represent a cell of the
     * @param {number} cellHeight
     * @param {string} cellFill
     * @param {string} containerStroke
     * @param {number} index
     * @returns {Rectangle}
     * @private
     */
    createCellRectangle: function( cellHeight, cellFill, containerStroke, index ) {
      var cellRectangle = new Rectangle( 0, 0, this.options.containerWidth, cellHeight, 0, 0, {
        fill: cellFill,
        lineWidth: 1,
        stroke: containerStroke,
        bottom: this.options.containerHeight - (index * cellHeight)
      } );
      return cellRectangle;
    }

  } );
} )
;