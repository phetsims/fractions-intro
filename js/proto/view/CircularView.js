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
  var CellSceneView = require( 'FRACTIONS_INTRO/proto/view/CellSceneView' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {ProtoModel} model
   */
  function CircularView( model ) {
    CellSceneView.call( this, model );
  }

  fractionsIntro.register( 'CircularView', CircularView );

  return inherit( CellSceneView, CircularView, {
    createContainerNode: function( container, cellDownCallback ) {
      return new CircularContainerNode( container, cellDownCallback );
    },

    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CircularPieceNode( piece, finishedAnimatingCallback, droppedCallback );
    }
  } );
} );
