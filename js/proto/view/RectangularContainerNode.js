// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangleNode = require( 'FRACTIONS_INTRO/proto/view/RectangleNode' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   * @extend {Rectangle}
   *
   * @param {ProtoContainer} container
   * @param {function} cellDownCallback TODO doc, function( event )
   */
  function RectangularContainerNode( container, cellDownCallback ) {
    // @private
    this.container = container;

    // @private
    this.cellDownCallback = cellDownCallback;

    // @private {Property.<string>}
    this.strokeProperty = new DerivedProperty( [ container.filledCellCountProperty ], function( count ) {
      return count > 0 ? 'black' : 'gray';
    } );

    Rectangle.call( this, {
      rectWidth: ProtoConstants.RECTANGULAR_SIZE.width,
      rectHeight: ProtoConstants.RECTANGULAR_SIZE.height,
      stroke: this.strokeProperty,
      lineWidth: 3
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
    getMidpointByIndex: function( index ) {
      var node = this.cellNodes[ index ];

      return node.translation.plus( node.midpointOffset );
    },

    rebuild: function() {
      var self = this;

      this.removeCellNodes();

      var denominator = this.container.cells.length;
      for ( var i = 0; i < denominator; i++ ) {
        (function() {
          var cell = self.container.cells.get( i );

          var cellNode = new RectangleNode( denominator );
          self.cellNodes.push( cellNode );
          self.addChild( cellNode );
          cellNode.cursor = 'pointer';
          cellNode.addInputListener( {
            down: function( event ) {
              self.cellDownCallback( cell, event );
            }
          } );

          var sortedIndex = denominator - i - 1;
          cellNode.y = ProtoConstants.RECTANGULAR_SIZE.height * sortedIndex / denominator;

          // TODO: don't do it this way
          cellNode.cell = cell;
          cellNode.visibilityListener = cell.appearsFilledProperty.linkAttribute( cellNode, 'visible' );
        })();
      }

      // sets the shape of the dividing lines between cells
      var cellDividersShape = new Shape();
      var cellHeight = ProtoConstants.RECTANGULAR_SIZE.height / denominator;
      for ( var j = 1; j < denominator; j++ ) {
        cellDividersShape.moveTo( 0, j * cellHeight )
          .horizontalLineToRelative( ProtoConstants.RECTANGULAR_SIZE.width );
      }
      self.cellDividersPath.setShape( cellDividersShape );

    },

    removeCellNodes: function() {
      while ( this.cellNodes.length ) {
        var cellNode = this.cellNodes.pop();
        cellNode.cell.appearsFilledProperty.unlink( cellNode.visibilityListener );
        this.removeChild( cellNode );
      }
    },

    dispose: function() {
      this.removeCellNodes();

      this.container.cells.lengthProperty.unlink( this.rebuildListener );
      this.strokeProperty.dispose();

      Rectangle.prototype.dispose.call( this );
    }

  } );
} )
;
