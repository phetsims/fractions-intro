// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CellSceneView = require( 'FRACTIONS_INTRO/intro/view/CellSceneView' );
  var RectangularContainerNode = require( 'FRACTIONS_INTRO/intro/view/RectangularContainerNode' );
  var RectangularPieceNode = require( 'FRACTIONS_INTRO/intro/view/RectangularPieceNode' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {IntroModel} model
   */
  function RectangularView( model ) {
    CellSceneView.call( this, model );
  }

  fractionsIntro.register( 'RectangularView', RectangularView );

  return inherit( CellSceneView, RectangularView, {
    createContainerNode: function( container, cellDownCallback ) {
      return new RectangularContainerNode( container, cellDownCallback );
    },

    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new RectangularPieceNode( piece, finishedAnimatingCallback, droppedCallback );
    }
  } );
} );
