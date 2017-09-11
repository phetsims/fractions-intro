// Copyright 2017, University of Colorado Boulder

/**
 * create a rectangle container
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangleNode = require( 'FRACTIONS_INTRO/intro/view/RectangleNode' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   * @extends {Rectangle}
   *
   * @param {Container} container
   * @param {function} cellDownCallback TODO doc, function( event )
   * @param {Object} [options]
   */
  function RectangularContainerNode( container, cellDownCallback, options ) {

    options = _.extend( {
        isIcon: false
      },
      options );

    // @private
    this.container = container;

    // @private
    this.cellDownCallback = cellDownCallback;

    // @private {Property.<string>}
    this.strokeProperty = new DerivedProperty( [ container.filledCellCountProperty ], function( count ) {
      return count > 0 ? 'black' : 'gray';
    } );

    this.options = options;

    // determine to the height and width to use when drawing the vertical or horizontal representation.
    this.rectangle = this.options.rectangleOrientation === 'horizontal' ? IntroConstants.HORIZONTAL_RECTANGULAR_SIZE : IntroConstants.VERTICAL_RECTANGULAR_SIZE;

    if ( options.isIcon ) {
      this.rectangle = new Dimension2( this.rectangle.width / 4, this.rectangle.height / 4 );
    }

    Rectangle.call( this, {
      rectWidth: this.rectangle.width,
      rectHeight: this.rectangle.height,
      stroke: this.strokeProperty,
      lineWidth: options.isIcon ? 2 : 3
    } );

    // @private {Path} creates the path for the dividing lines between cells
    this.cellDividersPath = new Path( null, { stroke: this.strokeProperty } );
    this.addChild( this.cellDividersPath );

    // @private {function}
    this.rebuildListener = this.rebuild.bind( this );

    // @private {Array.<RectangleNode>}
    this.cellNodes = [];

    container.cells.lengthProperty.link( this.rebuildListener );
  }

  fractionsIntro.register( 'RectangularContainerNode', RectangularContainerNode );

  return inherit( Rectangle, RectangularContainerNode, {

    /**
     * Returns midpoint of cell based off its index
     *
     * @param {number} index - the index of the cell
     * @returns {Vector2}
     * @public
     */
    getMidpointByIndex: function( index ) {
      var node = this.cellNodes[ index ];

      return node.translation.plus( node.midpointOffset );
    },

    /**
     * Redraws Rectangular Containers on screen view when the denominator is changed
     * @private
     */
    rebuild: function() {
      var self = this;
      this.removeCellNodes();
      var denominator = this.container.cells.length;
      for ( var i = 0; i < denominator; i++ ) {
        (function() {
          var cell = self.container.cells.get( i );
          var cellNode = new RectangleNode( denominator, self.options );
          self.cellNodes.push( cellNode );
          self.addChild( cellNode );
          cellNode.cursor = 'pointer';
          cellNode.addInputListener( {
            down: function( event ) {
              self.cellDownCallback( cell, event );
            }
          } );
          if ( self.options.rectangleOrientation === 'horizontal' ) {
            cellNode.x = self.rectangle.width * i / denominator;
          }
          else {
            var sortedIndex = denominator - i - 1;
            cellNode.y = self.rectangle.height * sortedIndex / denominator;
          }

          // TODO: don't do it this way
          cellNode.cell = cell;
          cellNode.visibilityListener = cell.appearsFilledProperty.linkAttribute( cellNode, 'visible' );
        })();
      }

      if ( self.options.rectangleOrientation === 'vertical' ) {

        // sets the shape of the dividing lines between cells
        var cellDividersShape = new Shape();
        var cellHeight = self.rectangle.height / denominator;
        for ( var j = 1; j < denominator; j++ ) {
          cellDividersShape.moveTo( 0, j * cellHeight )
            .horizontalLineToRelative( self.rectangle.width );
        }
        self.cellDividersPath.setShape( cellDividersShape );
      }
      else {
        // sets the shape of the dividing lines between cells
        cellDividersShape = new Shape();
        var cellWidth = self.rectangle.width / denominator;
        for ( var x = 1; x < denominator; x++ ) {
          cellDividersShape.moveTo( x * cellWidth, 0 )
            .verticalLineToRelative( self.rectangle.height );
        }
        self.cellDividersPath.setShape( cellDividersShape );
      }

    },

    /**
     * Empties cellsNode array, removes all cell from the scene and unlinks them from visibility listeners
     * @private
     */
    removeCellNodes: function() {
      while ( this.cellNodes.length ) {
        var cellNode = this.cellNodes.pop();
        cellNode.cell.appearsFilledProperty.unlink( cellNode.visibilityListener );
        this.removeChild( cellNode );
      }
    },

    /**
     * removeCellNodes + unlinks whole container from rebuild listener
     * @public
     */
    dispose: function() {
      this.removeCellNodes();

      this.container.cells.lengthProperty.unlink( this.rebuildListener );
      this.strokeProperty.dispose();

      Rectangle.prototype.dispose.call( this );
    },

    /**
     *  creates Rectangular Node with one fill cell
     *  @public
     */
    isIcon: function() {
      this.container.cells.fill();
    }
  } );
} )
;
