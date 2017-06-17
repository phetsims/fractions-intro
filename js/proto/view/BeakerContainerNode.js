// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'FRACTIONS_INTRO/proto/view/BeakerNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: factor out common things with the other container nodes
   *
   * @param {ProtoContainer} container
   * @param {function} cellDownCallback TODO doc, function( event )
   */
  function BeakerContainerNode( container, cellDownCallback ) {
    var self = this;

    Node.call( this );

    // @private
    this.container = container;

    // @private
    this.cellDownCallback = cellDownCallback;

    // @private {Multilink}
    this.multilink = Property.multilink( [ container.filledCellCountProperty, container.cells.lengthProperty ], function( numerator, denominator ) {
      // Sanity, if these get modified out of order (very possible)
      numerator = Math.min( numerator, denominator );

      self.children = [
        new BeakerNode( numerator, denominator )
      ];
    } );

    // @private
    this.cursorListener = this.updateCursor.bind( this );

    container.filledCellCountProperty.link( this.cursorListener );

    this.addInputListener( {
      down: function( event ) {
        if ( container.filledCellCountProperty.value > 0 ) {
          cellDownCallback( event );
        }
      }
    } );

  }

  fractionsIntro.register( 'BeakerContainerNode', BeakerContainerNode );

  return inherit( Node, BeakerContainerNode, {
    updateCursor: function() {
      this.cursor = this.container.filledCellCountProperty.value > 0 ? 'pointer' : null;
    },

    dispose: function() {
      this.multilink.dispose();

      this.container.filledCellCountProperty.unlink( this.cursorListener );

      Node.prototype.dispose.call( this );
    }
  } );
} );
