// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for the container set of cakes with a bucketNode
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CakeContainerNode = require( 'FRACTIONS_INTRO/intro/view/CakeContainerNode' );
  var CakePieceNode = require( 'FRACTIONS_INTRO/intro/view/CakePieceNode' );
  var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
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

    CellSceneView.call( this, model, { horizontalSpacing: -20 } );
  }

  fractionsIntro.register( 'CakeView', CakeView );

  return inherit( CellSceneView, CakeView, {
    /**
     * create a cake container that holds a cake plate and the cakeNodes
     * @param {Container} container
     * @param {Function} cellDownCallback
     * @returns {CakeContainerNode}
     * @public
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
     * @public
     */
    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CakePieceNode( piece, finishedAnimatingCallback, droppedCallback );
    },

    /**
     * Creates a cell node of a cake aka slice
     *
     * @param {number} denominator
     * @param {number} index
     * @param {Object} [options]
     * @returns {CakeNode}
     * @public
     */
    createCellNode: function( denominator, index, options ) {
      return new CakeNode( denominator, index, options );
    }
  } );
} );
