// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for displaying cakes and cake slices in fractions-intro
 * @author Michael Moorer (Berea College)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // images
  var cake_1_1Image = require( 'image!FRACTIONS_INTRO/cake_1_1.png' );
  var cake_2_1Image = require( 'image!FRACTIONS_INTRO/cake_2_1.png' );
  var cake_2_2Image = require( 'image!FRACTIONS_INTRO/cake_2_2.png' );
  var cake_3_1Image = require( 'image!FRACTIONS_INTRO/cake_3_1.png' );
  var cake_3_2Image = require( 'image!FRACTIONS_INTRO/cake_3_2.png' );
  var cake_3_3Image = require( 'image!FRACTIONS_INTRO/cake_3_3.png' );
  var cake_4_1Image = require( 'image!FRACTIONS_INTRO/cake_4_1.png' );
  var cake_4_2Image = require( 'image!FRACTIONS_INTRO/cake_4_2.png' );
  var cake_4_3Image = require( 'image!FRACTIONS_INTRO/cake_4_3.png' );
  var cake_4_4Image = require( 'image!FRACTIONS_INTRO/cake_4_4.png' );
  var cake_5_1Image = require( 'image!FRACTIONS_INTRO/cake_5_1.png' );
  var cake_5_2Image = require( 'image!FRACTIONS_INTRO/cake_5_2.png' );
  var cake_5_3Image = require( 'image!FRACTIONS_INTRO/cake_5_3.png' );
  var cake_5_4Image = require( 'image!FRACTIONS_INTRO/cake_5_4.png' );
  var cake_5_5Image = require( 'image!FRACTIONS_INTRO/cake_5_5.png' );
  var cake_6_1Image = require( 'image!FRACTIONS_INTRO/cake_6_1.png' );
  var cake_6_2Image = require( 'image!FRACTIONS_INTRO/cake_6_2.png' );
  var cake_6_3Image = require( 'image!FRACTIONS_INTRO/cake_6_3.png' );
  var cake_6_4Image = require( 'image!FRACTIONS_INTRO/cake_6_4.png' );
  var cake_6_5Image = require( 'image!FRACTIONS_INTRO/cake_6_5.png' );
  var cake_6_6Image = require( 'image!FRACTIONS_INTRO/cake_6_6.png' );
  var cake_7_1Image = require( 'image!FRACTIONS_INTRO/cake_7_1.png' );
  var cake_7_2Image = require( 'image!FRACTIONS_INTRO/cake_7_2.png' );
  var cake_7_3Image = require( 'image!FRACTIONS_INTRO/cake_7_3.png' );
  var cake_7_4Image = require( 'image!FRACTIONS_INTRO/cake_7_4.png' );
  var cake_7_5Image = require( 'image!FRACTIONS_INTRO/cake_7_5.png' );
  var cake_7_6Image = require( 'image!FRACTIONS_INTRO/cake_7_6.png' );
  var cake_7_7Image = require( 'image!FRACTIONS_INTRO/cake_7_7.png' );
  var cake_8_1Image = require( 'image!FRACTIONS_INTRO/cake_8_1.png' );
  var cake_8_2Image = require( 'image!FRACTIONS_INTRO/cake_8_2.png' );
  var cake_8_3Image = require( 'image!FRACTIONS_INTRO/cake_8_3.png' );
  var cake_8_4Image = require( 'image!FRACTIONS_INTRO/cake_8_4.png' );
  var cake_8_5Image = require( 'image!FRACTIONS_INTRO/cake_8_5.png' );
  var cake_8_6Image = require( 'image!FRACTIONS_INTRO/cake_8_6.png' );
  var cake_8_7Image = require( 'image!FRACTIONS_INTRO/cake_8_7.png' );
  var cake_8_8Image = require( 'image!FRACTIONS_INTRO/cake_8_8.png' );

  var cake_grid_1Image = require( 'image!FRACTIONS_INTRO/cake_grid_1.png' );
  var cake_grid_2Image = require( 'image!FRACTIONS_INTRO/cake_grid_2.png' );
  var cake_grid_3Image = require( 'image!FRACTIONS_INTRO/cake_grid_3.png' );
  var cake_grid_4Image = require( 'image!FRACTIONS_INTRO/cake_grid_4.png' );
  var cake_grid_5Image = require( 'image!FRACTIONS_INTRO/cake_grid_5.png' );
  var cake_grid_6Image = require( 'image!FRACTIONS_INTRO/cake_grid_6.png' );
  var cake_grid_7Image = require( 'image!FRACTIONS_INTRO/cake_grid_7.png' );
  var cake_grid_8Image = require( 'image!FRACTIONS_INTRO/cake_grid_8.png' );

  var cakeImageArray = [
    [ cake_1_1Image ],
    [ cake_2_1Image, cake_2_2Image ],
    [ cake_3_1Image, cake_3_2Image, cake_3_3Image ],
    [ cake_4_1Image, cake_4_2Image, cake_4_3Image, cake_4_4Image ],
    [ cake_5_1Image, cake_5_2Image, cake_5_3Image, cake_5_4Image, cake_5_5Image ],
    [ cake_6_1Image, cake_6_2Image, cake_6_3Image, cake_6_4Image, cake_6_5Image, cake_6_6Image ],
    [ cake_7_1Image, cake_7_2Image, cake_7_3Image, cake_7_4Image, cake_7_5Image, cake_7_6Image, cake_7_7Image ],
    [ cake_8_1Image, cake_8_2Image, cake_8_3Image, cake_8_4Image, cake_8_5Image, cake_8_6Image, cake_8_7Image,
      cake_8_8Image ]
  ];

  var cakeGridImageArray = [
    cake_grid_1Image,
    cake_grid_2Image,
    cake_grid_3Image,
    cake_grid_4Image,
    cake_grid_5Image,
    cake_grid_6Image,
    cake_grid_7Image,
    cake_grid_8Image
  ];

  /**
   * @param {ContainerSet} containerSet
   * @param {object} [options]
   * @constructor
   */
  function CakeNode( containerSet, options ) {

    options = _.extend( {
      maxHeight: 160, // maximum height of this node
      visibleBackground: true, // is the grid and white ellipse background visible
      spacing: 180 // separation of two adjacent cakes
    }, options );

    Node.call( this );

    var self = this;

    var updateCakesDisplay = function() {

      // TODO: check how much of a performance hit to use such a simple approach
      self.removeAllChildren();

      var numberOfContainers = containerSet.containers.length;

      var numberOfCells = containerSet.denominatorProperty.value;

      containerSet.containers.forEach( function( container, index ) {

        // centerX position of the cake associated with this container
        var centerX = (index - numberOfContainers / 2) * options.spacing;

        // is the cakePlate visible
        if ( options.visibleBackground ) {
          var cakePlateNode = self.getCakePlateNode( numberOfCells );
          cakePlateNode.centerX = centerX;
          self.addChild( cakePlateNode );
        }

        // TODO: but the slices in the first container will be beneath
        // slices in other containers.
        if ( !container.isContainerEmpty() ) {

          // all the slices associated with this container
          var slicesNode = self.getSlicesNode( container );
          slicesNode.centerX = centerX;
          self.addChild( slicesNode );
        }
      } );
    };

    // needs to be called once or the beginning state of the containers will not be displayed
    updateCakesDisplay();

    // add listener to container sets
    containerSet.containersEmitter.addListener( function() {
      updateCakesDisplay();
    } );

    this.mutate( options );
  }

  fractionsIntro.register( 'CakeNode', CakeNode );

  return inherit( Node, CakeNode, {
    /**
     * returns a scenery Node with slices of a cake
     * @param {Container} container
     * @returns {Node}
     * @private
     */
    getSlicesNode: function( container ) {

      // an array of cells {Cell[]}
      var cells = container.cells;

      // the number of cells in the container
      var numberOfCells = cells.length;

      // {number[]} an array indicating the appropriate z order of a slice of cake
      var zLayerArray = this.zLayerOrder( numberOfCells );

      // {Image[]} array of cake slices arranged in z-order from back to front
      var slicesImage = [];

      cells.forEach( function( cell, index ) {

        // check is the cell is filled with a slice
        if ( cell.isFilledProperty.value ) {

          // {integer} order of the slice, higher value indicates a higher z value
          var zOrder = zLayerArray[ index ];

          // place the cakeImage in the z ordered array
          slicesImage[ zOrder ] = new Image( cakeImageArray[ numberOfCells - 1 ][ index ] );
        }
      } );

      // remove all missing cakeImage from slicesImage array
      slicesImage = slicesImage.filter( function( n ) { return n !== undefined; } );

      return new Node( { children: slicesImage } );
    },

    /**
     * returns a scenery Node of the cake plate with grid and white background
     * @param {number} numberOfCells
     * @returns {Node}
     * @private
     */
    getCakePlateNode: function( numberOfCells ) {

      // add grid image of the cake with the appropriate number of cells
      var gridImage = new Image( cakeGridImageArray[ numberOfCells - 1 ] );

      // create white background for the cake.
      // The shape of the ellipse is determined empirically based on the image
      var cakeGridBase = new Path( Shape.ellipse(
        gridImage.width / 2,
        gridImage.height * 0.635,
        gridImage.width * 0.364,
        gridImage.height * 0.277, 0 ), {
        fill: 'white'
      } );

      return new Node( { children: [ cakeGridBase, gridImage ] } );
    },
    /**
     * Each array corresponds to the z layers of the cake slices
     * The higher the value in the array, the higher the z-order level
     * For instance for a denominator of 2, the array [1,0] indicates that
     * the 0th element has a z value of 1 and is on top of the 1st element whose z value is 0

     * @param {number} denominator
     * @returns {number[]}
     * @private
     */
    zLayerOrder: function( denominator ) {
      switch( denominator ) {
        case 1:
          return [ 0 ];
        case 2:
          return [ 1, 0 ];
        case 3:
          return [ 0, 1, 2 ];
        case 4:
          return [ 0, 1, 2, 3 ];
        case 5:
          return [ 1, 0, 2, 4, 3 ];
        case 6:
          return [ 1, 0, 2, 3, 5, 4 ];
        case 7:
          return [ 1, 0, 2, 3, 4, 6, 5 ];
        case 8:
          return [ 1, 0, 2, 3, 4, 5, 7, 6 ];
        default:
          throw new Error( 'Unknown denominator: ' + denominator );
      }
    }
  } );
} );

