// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CakeContainerNode = require( 'FRACTIONS_INTRO/proto/view/CakeContainerNode' );
  var CakePieceNode = require( 'FRACTIONS_INTRO/proto/view/CakePieceNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CellSceneView = require( 'FRACTIONS_INTRO/proto/view/CellSceneView' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {ProtoModel} model
   */
  function CakeView( model ) {
    CellSceneView.call( this, model );
  }

  fractionsIntro.register( 'CakeView', CakeView );

  return inherit( CellSceneView, CakeView, {
    createContainerNode: function( container, cellDownCallback ) {
      return new CakeContainerNode( container, cellDownCallback );
    },

    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CakePieceNode( piece, finishedAnimatingCallback, droppedCallback );
    }
  } );
} );
