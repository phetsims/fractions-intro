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
  var Node = require( 'SCENERY/nodes/Node' );
  var PieceDragHandler = require( 'FRACTIONS_INTRO/intro/view/PieceDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constant
  var CONTAINER_WIDTH = 130;
  var CONTAINER_HEIGHT = 185;

  /**
   *
   * @param {ContainerSet} containerSet
   * @param {ObservableArray.<Piece>} pieces
   * @param {Object} [options]
   * @constructor
   */
  function VerticalBarNode( containerSet, pieces, options ) {
    options = _.extend( {
        align: 'center',
        containerSpacing: 22,
        containerWidth: 130,
        containerHeight: 185,
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
    var setOfVerticalBarNode = new Node();
    this.addChild( setOfVerticalBarNode );

    // function for displaying the containers
    this.displayContainers = function() {

      setOfVerticalBarNode.removeAllChildren();

      // loop over all the containers in the container set
      containerSet.containers.forEach( function( container, containerIndex ) {

        var containerNode = new Node();

        // outline of the container and inner line depend on the filled status of the container
        var containerStroke = container.isContainerEmpty() ? 'grey' : 'black';
        var containerRectangle = new Rectangle( {
          rectWidth: options.containerWidth,
          rectHeight: options.containerHeight,
          stroke: containerStroke,
          lineWidth: options.outlineLineWidth
        } );

        // TODO pass these as options to the function?
        containerRectangle.centerX = 512 + ( options.containerWidth + options.containerSpacing) *
                                           (containerIndex - (containerSet.containers.length - 1) / 2);
        containerRectangle.centerY = 260;

        var numberOfCells = container.cells.length;
        var cellHeight = options.containerHeight / numberOfCells;

        // an array holder that will hold the cell Rectangles
        var cellsRectangle = [];

        // create the cells for the container
        container.cells.forEach( function( cell, index ) {

          // the fill of the cell depends upon the filled property
          var cellFill = cell.isFilledProperty.value ? '#FFE600' : 'white';

          var cellRectangle = self.createCellRectangle( cellHeight, cellFill, containerStroke, index );

          // TODO pass these as options to the function?
          cellRectangle.centerY = ((numberOfCells - 1) / 2 - index) * cellHeight + containerRectangle.centerY;
          cellRectangle.centerX = containerRectangle.centerX;

          cell.positionProperty.value = cellRectangle.center;
          cell.boundsProperty.value = cellRectangle.bounds;

          if ( cell.isFilled() ) {
            cellRectangle.addInputListener(
              new PieceDragHandler( cell.positionProperty.value,
                containerSet,
                pieces, {
                  startDrag: function() {
                    containerSet.emptyThisCell( cell );
                  }
                } ) );
          }
          cellsRectangle.push( cellRectangle );

        } );

        containerNode.setChildren( cellsRectangle );
        containerNode.addChild( containerRectangle );

        setOfVerticalBarNode.addChild( containerNode );
      } );

    };

    // needs to be called once or the beginning state of the containers will not be displayed
    this.displayContainers();

    // add listener to container sets
    containerSet.containersEmitter.addListener( function() {
      self.displayContainers();
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

        // make one cell
        var cellRectangle = new Rectangle( {
          rectWidth: CONTAINER_WIDTH,
          rectHeight: cellHeight,
          fill: '#FFE600',
          lineWidth: 1,
          stroke: 'black',
          centerY: 0
        } );
        containerNode.addChild( cellRectangle );
      } );

      return containerNode;

    },

    /**
     * creates a rectangle to be used to represent a cell of the
     * @param {number} cellHeight
     * @param {string} cellFill
     * @param {string} containerStroke
     * @returns {Rectangle}
     * @private
     */
    createCellRectangle: function( cellHeight, cellFill, containerStroke ) {
      var cellRectangle = new Rectangle( {
        rectWidth: this.options.containerWidth,
        rectHeight: cellHeight,
        fill: cellFill,
        lineWidth: 1,
        stroke: containerStroke
      } );
      return cellRectangle;
    }

  } );
} );