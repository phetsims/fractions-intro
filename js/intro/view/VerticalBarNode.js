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

  // constant
  var CONTAINER_WIDTH = 130;
  var CONTAINER_HEIGHT = 185;
  var RECTANGLE_SPACING = 22;
  var RECTANGLE_TOP = 160;

  /**
   *
   * @param {IntroModel} introModel
   * @param {Object} [options]
   * @constructor
   */
  function VerticalBarNode( introModel, options ) {
    options = _.extend( {
        align: 'center',
        spacing: RECTANGLE_SPACING
      },
      options );

    Node.call( this );
    var self = this;

    // A HBox to hold the set of containers
    var setOfContainers = new HBox( options );
    this.addChild( setOfContainers );

    // function for displaying the containers
    function displayContainers() {

      var containersLayer = [];

      // loop over all the containers in the container set
      introModel.containerSet.containers.forEach( function( container ) {

        var containerNode = new Node();

        // outline of the container and inner line depend on the filled status of the container
        var containerStroke = container.isContainerEmpty() ? 'grey' : 'black';

        var containerRectangle = new Rectangle( 0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0, 0, {
          stroke: containerStroke,
          lineWidth: 3
        } );

        var numberOfCells = container.cells.length;
        var cellHeight = CONTAINER_HEIGHT / numberOfCells;

        // an array holder that will hold the cell Rectangles
        var cellsRectangle = [];

        // create the cells for the container
        container.cells.forEach( function( cell, index ) {

          // the fill of the cell depends upon the filled property
          var cellFill = cell.isFilledProperty.value ? '#FFE600' : 'white';
          var cellRectangle = new Rectangle( 0, 0, CONTAINER_WIDTH, cellHeight, 0, 0, {
            fill: cellFill,
            lineWidth: 1,
            stroke: containerStroke,
            top: index * cellHeight
          } );

          cellsRectangle.push( cellRectangle );

        } );

        containerNode.setChildren( cellsRectangle );
        containerNode.addChild( containerRectangle );
        containersLayer.push( containerNode );
      } );

      setOfContainers.setChildren( containersLayer );
      self.centerX = options.centerX;
      self.top = RECTANGLE_TOP;
    }

    // needs to be called once or the beginning state of the containers will not be displayed
    displayContainers();

    // add listener to container sets
    introModel.containerSet.containersEmitter.addListener( function() {
      displayContainers();
    } );
  }

  fractionsIntro.register( 'VerticalBarNode', VerticalBarNode );

  return inherit( Node, VerticalBarNode );
} );
