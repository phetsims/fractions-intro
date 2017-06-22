// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for the container set of cakes with a bucket
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CakeContainerNode = require( 'FRACTIONS_INTRO/intro/view/CakeContainerNode' );
  var CakePieceNode = require( 'FRACTIONS_INTRO/intro/view/CakePieceNode' );
  var CellSceneView = require( 'FRACTIONS_INTRO/intro/view/CellSceneView' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {IntroModel} model
   */
  function CakeView( model ) {
    CellSceneView.call( this, model );
  }

  fractionsIntro.register( 'CakeView', CakeView );

  return inherit( CellSceneView, CakeView, {
    /**
     * create a cake container that holds a cake plate and the cakeNodes
     * @param {Container} container
     * @param {Function} cellDownCallback
     * @returns {CakeContainerNode}
     * @private
     */
    createContainerNode: function( container, cellDownCallback ) {
      return new CakeContainerNode( container, cellDownCallback );
    },

    /**
     * create a cake piece node
     * @param {Piece} piece
     * @param {Function} finishedAnimatingCallback
     * @param {Function} droppedCallback
     * @returns {CakePieceNode}
     * @private
     */
    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CakePieceNode( piece, finishedAnimatingCallback, droppedCallback );
    }
  } );
} );
