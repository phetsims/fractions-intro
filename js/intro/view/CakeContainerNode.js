// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // images
  var cake_grid_1Image = require( 'image!FRACTIONS_INTRO/cake_grid_1.png' );
  var cake_grid_2Image = require( 'image!FRACTIONS_INTRO/cake_grid_2.png' );
  var cake_grid_3Image = require( 'image!FRACTIONS_INTRO/cake_grid_3.png' );
  var cake_grid_4Image = require( 'image!FRACTIONS_INTRO/cake_grid_4.png' );
  var cake_grid_5Image = require( 'image!FRACTIONS_INTRO/cake_grid_5.png' );
  var cake_grid_6Image = require( 'image!FRACTIONS_INTRO/cake_grid_6.png' );
  var cake_grid_7Image = require( 'image!FRACTIONS_INTRO/cake_grid_7.png' );
  var cake_grid_8Image = require( 'image!FRACTIONS_INTRO/cake_grid_8.png' );

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
   * @constructor
   * @extends {Node}
   *
   * TODO: factor out common things with RectangularContainerNode and CircularContainerNode
   *
   * @param {Container} container
   * @param {function} cellDownCallback TODO doc, function( event )
   */
  function CakeContainerNode( container, cellDownCallback ) {
    // @private
    this.container = container;

    // @private
    this.cellDownCallback = cellDownCallback;

    // @private {Image} create grid image of the cake with the appropriate number of cells
    this.gridImage = new Image( cakeGridImageArray[ container.cells.lengthProperty.value - 1 ] );

    // create white background for the cake.
    // The shape of the ellipse is determined empirically based on the image
    var cakeGridBase = new Path( Shape.ellipse(
      this.gridImage.width / 2,
      this.gridImage.height * 0.635,
      this.gridImage.width * 0.364,
      this.gridImage.height * 0.277, 0 ), {
      fill: 'white'
    } );

    // @private {Node} Node layer to hold the cake slices with the correct z-order
    this.cakeLayers = new Node();

    Node.call( this, {
      children: [ cakeGridBase, this.gridImage, this.cakeLayers ]
    } );

    // @private {function}
    this.rebuildListener = this.rebuild.bind( this );

    // @private {Array.<CakeNode>}
    this.cellNodes = [];

    container.cells.lengthProperty.link( this.rebuildListener );
  }

  fractionsIntro.register( 'CakeContainerNode', CakeContainerNode );

  return inherit( Node, CakeContainerNode, {

    /**
     *
     * @param {number} index
     * @returns {Vector2}
     */
    getMidpointByIndex: function( index ) {
      var node = this.cellNodes[ index ];

      return node.translation.plus( node.midpointOffset );
    },

    /**
     * rebuild the container
     * @private
     */
    rebuild: function() {
      var self = this;

      this.removeCellNodes();

      var denominator = this.container.cells.length;

      // update the grid image
      this.gridImage.setImage( cakeGridImageArray[ denominator - 1 ] );

      // {number[]} an array indicating the appropriate z order of a slice of cake, see zLayerOrder method for more details
      var zLayerArray = this.zLayerOrder( denominator );

      // {Image[]} array of cake slices arranged in z-order from back to front
      var slicesImage = [];

      for ( var i = 0; i < denominator; i++ ) {
        (function() {
          var cell = self.container.cells.get( i );

          // {integer} order of the slice, higher value indicates a higher z value
          var zOrder = zLayerArray[ i ];

          // place the cakeImage in the z ordered array
          var cellNode = new CakeNode( denominator, i );
          slicesImage[ zOrder ] = cellNode;

          self.cellNodes.push( cellNode );
          cellNode.cursor = 'pointer';
          cellNode.addInputListener( {
            down: function( event ) {
              self.cellDownCallback( cell, event );
            }
          } );

          // TODO: don't do it this way
          cellNode.cell = cell;
          cellNode.visibilityListener = cell.appearsFilledProperty.linkAttribute( cellNode, 'visible' );
        })();
      }
      // remove all missing cakeImage from slicesImage array
      slicesImage = slicesImage.filter( function( n ) { return n !== undefined; } );

      self.cakeLayers.setChildren( slicesImage );
    },

    /**
     *
     */
    removeCellNodes: function() {
      while ( this.cellNodes.length ) {
        var cellNode = this.cellNodes.pop();
        cellNode.cell.appearsFilledProperty.unlink( cellNode.visibilityListener );
        this.cakeLayers.removeChild( cellNode );
      }
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
    },

    /**
     * @public
     */
    dispose: function() {
      this.removeCellNodes();
      this.container.cells.lengthProperty.unlink( this.rebuildListener );
      Node.prototype.dispose.call( this );
    }
  } );
} );
