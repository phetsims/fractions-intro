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
  var Vector2 = require( 'DOT/Vector2' );

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
        outlineLineWidth: 3,
        isIcon: false //  is an icon without drag ability
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

        // TODO: remove magic numbers
        container.positionProperty.value = new Vector2( 512 + ( options.containerWidth + options.containerSpacing) *
                                                              (containerIndex - (containerSet.containers.length - 1) / 2),
          260 );

        var containerNode = new Node();

        // outline of the container and inner line depend on the filled status of the container
        var containerStroke = container.isContainerEmpty() ? 'grey' : 'black';

        var containerRectangle = new Rectangle( {
          rectWidth: options.containerWidth,
          rectHeight: options.containerHeight,
          stroke: containerStroke,
          lineWidth: options.outlineLineWidth,
          center: container.positionProperty.value
        } );

        var numberOfCells = container.cells.length;
        var cellHeight = options.containerHeight / numberOfCells;

        // an array holder that will hold the cell Rectangles
        var cellsRectangle = [];

        // create the cells for the container
        container.cells.forEach( function( cell, index ) {

          // set the position of the cell
          cell.positionProperty.value = container.positionProperty.value
            .plusXY( 0, ((numberOfCells - 1) / 2 - index) * cellHeight );

          // the fill of the cell depends upon the filled property
          var cellFill = cell.isFilledProperty.value ? '#FFE600' : 'white';

          // create cell rectangle
          var cellRectangle = new Rectangle( {
            rectWidth: self.options.containerWidth,
            rectHeight: cellHeight,
            fill: cellFill,
            stroke: containerStroke,
            center: cell.positionProperty.value
          } );

          cellRectangle.center = cell.positionProperty.value;

          cell.boundsProperty.value = cellRectangle.bounds;

          if ( cell.isFilled() && !options.isIcon ) {
            cellRectangle.addInputListener(
              new PieceDragHandler( cell.positionProperty.value,
                containerSet,
                pieces, {
                  startDrag: function() {
                    cell.toggleIsFilled();
                    containerSet.updatedContainersEmitter.emit();
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
    containerSet.updatedContainersEmitter.addListener( function() {
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

      // make one cell
      var cellRectangle = new Rectangle( {
        rectWidth: CONTAINER_WIDTH,
        fill: '#FFE600',
        stroke: 'black'
      } );

      var dropShadowOffset = 5;

      // create the droppedShadow
      var droppedShadowRectangle = new Rectangle( {
        rectWidth: CONTAINER_WIDTH,
        fill: 'black',
        center: cellRectangle.center.plusXY( dropShadowOffset, dropShadowOffset )
      } );

      containerNode.setChildren( [ droppedShadowRectangle, cellRectangle ] );

      denominatorProperty.link( function( denominator ) {
        var cellHeight = CONTAINER_HEIGHT / denominator;

        // adjust height of the rectangles
        cellRectangle.rectHeight = cellHeight;
        droppedShadowRectangle.rectHeight = cellHeight;

        // center the cells vertically
        cellRectangle.centerY = 0;
        droppedShadowRectangle.centerY = dropShadowOffset;
      } );

      return containerNode;

    }

  } );
} );