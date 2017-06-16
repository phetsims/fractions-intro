// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var RectangularContainerNode = require( 'FRACTIONS_INTRO/proto/view/RectangularContainerNode' );

  /**
   * @constructor
   * @extends {HBox}
   *
   * @param {ProtoModel} model
   */
  function RectangularView( model ) {
    // @private
    this.model = model;

    HBox.call( this, {
      spacing: 30
    } );

    // @private {Array.<RectangularContainerNode>}
    this.containerNodes = [];

    // @private {function}
    this.addListener = this.addContainer.bind( this );
    this.removeListener = this.removeContainer.bind( this );

    model.containers.addItemAddedListener( this.addListener );
    model.containers.addItemRemovedListener( this.removeListener );

    // Initial setup
    model.containers.forEach( this.addListener );
  }

  fractionsIntro.register( 'RectangularView', RectangularView );

  return inherit( HBox, RectangularView, {
    addContainer: function( container ) {
      var containerNode = new RectangularContainerNode( container );

      this.containerNodes.push( containerNode );
      this.addChild( containerNode );
    },
    removeContainer: function( container ) {
      var containerNode = _.find( this.containerNodes, function( containerNode ) {
        return containerNode.container === container;
      } );

      this.removeChild( containerNode );
      arrayRemove( this.containerNodes, containerNode );

      containerNode.dispose();
    },
    dispose: function() {
      _.each( this.containerNodes, function( containerNode ) {
        containerNode.dispose();
      } );

      this.model.containers.removeItemAddedListener( this.addListener );
      this.model.containers.removeItemRemovedListener( this.removeListener );

      HBox.prototype.dispose.call( this );
    }
  } );
} );
