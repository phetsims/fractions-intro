// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CircularContainerNode = require( 'FRACTIONS_INTRO/proto/view/CircularContainerNode' );
  var CircularPieceNode = require( 'FRACTIONS_INTRO/proto/view/CircularPieceNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProtoSceneView = require( 'FRACTIONS_INTRO/proto/view/ProtoSceneView' );

  /**
   * @constructor
   * @extends {ProtoSceneView}
   *
   * @param {ProtoModel} model
   */
  function CircularView( model ) {
    ProtoSceneView.call( this, model );
  }

  fractionsIntro.register( 'CircularView', CircularView );

  return inherit( ProtoSceneView, CircularView, {
    createContainerNode: function( container, cellDownCallback ) {
      return new CircularContainerNode( container, cellDownCallback );
    },

    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CircularPieceNode( piece, finishedAnimatingCallback, droppedCallback );
    }
  } );
} );
