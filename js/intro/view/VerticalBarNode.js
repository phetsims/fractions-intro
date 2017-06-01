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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // constant
  var CONTAINER_WIDTH = 130;
  var CONTAINER_HEIGHT = 185;

  /**
   *
   * @param {ContainerSet} containerSet
   * @param {Object} [options]
   * @constructor
   */
  function VerticalBarNode( containerSet, options ) {
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
    var self = this;

    // A HBox to hold the set of containers
    var setOfContainers = new HBox( { align: options.align, spacing: options.containerSpacing } );
    this.addChild( setOfContainers );

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
          var cellRectangle = new Rectangle( 0, 0, options.containerWidth, cellHeight, 0, 0, {
            fill: cellFill,
            lineWidth: 1,
            stroke: containerStroke,
            bottom: options.containerHeight - (index * cellHeight)
          } );

          cellsRectangle.push( cellRectangle );

        } );

        containerNode.setChildren( cellsRectangle );
        containerNode.addChild( containerRectangle );
        containersLayer.push( containerNode );
      } );

      setOfContainers.setChildren( containersLayer );
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

    }

  } );
} );