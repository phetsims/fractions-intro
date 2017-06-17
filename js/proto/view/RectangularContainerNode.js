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
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangleNode = require( 'FRACTIONS_INTRO/proto/view/RectangleNode' );

  /**
   * @constructor
   * @extends {Rectangle}
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

    // @private {function}
    this.rebuildListener = this.rebuild.bind( this );

    // @private {Array.<RectangleNode>}
    this.cellNodes = [];

    container.cells.lengthProperty.link( this.rebuildListener );
  }

  fractionsIntro.register( 'RectangularContainerNode', RectangularContainerNode );

  return inherit( Rectangle, RectangularContainerNode, {
    getCenterByIndex: function( index ) {
      return this.cellNodes[ index ].center;
    },

    rebuild: function() {
      var self = this;

      this.removeCellNodes();

      var denominator = this.container.cells.length;
      for ( var i = 0; i < denominator; i++ ) {
        (function(){
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
} );
