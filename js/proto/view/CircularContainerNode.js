// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CircleNode = require( 'FRACTIONS_INTRO/proto/view/CircleNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );

  /**
   * @constructor
   * @extends {Circle}
   *
   * TODO: factor out common things with RectangularContainerNode
   *
   * @param {ProtoContainer} container
   */
  function CircularContainerNode( container ) {
    // @private
    this.container = container;

    // @private {Property.<string>} TODO factor out?
    this.strokeProperty = new DerivedProperty( [ container.filledCellCountProperty ], function( count ) {
      return count > 0 ? 'black' : 'gray';
    } );

    Circle.call( this, ProtoConstants.CIRCULAR_RADIUS, {
      stroke: this.strokeProperty
    } );

    // @private {function}
    this.rebuildListener = this.rebuild.bind( this );

    // @private {Array.<CircleNode>}
    this.cellNodes = [];

    container.cells.lengthProperty.link( this.rebuildListener );
  }

  fractionsIntro.register( 'CircularContainerNode', CircularContainerNode );

  return inherit( Circle, CircularContainerNode, {
    rebuild: function() {
      this.removeCellNodes();

      var denominator = this.container.cells.length;
      for ( var i = 0; i < denominator; i++ ) {
        var cell = this.container.cells.get( i );

        var cellNode = new CircleNode( denominator, i );
        this.cellNodes.push( cellNode );
        this.addChild( cellNode );

        // TODO: don't do it this way
        cellNode.cell = cell;
        cellNode.visibilityListener = cell.appearsFilledProperty.linkAttribute( cellNode, 'visible' );
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

      Circle.prototype.dispose.call( this );
    }
  } );
} );
