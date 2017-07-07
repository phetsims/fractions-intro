// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node for the container set of circles with a bucketNode
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CircularContainerNode = require( 'FRACTIONS_INTRO/intro/view/CircularContainerNode' );
  var CircularPieceNode = require( 'FRACTIONS_INTRO/intro/view/CircularPieceNode' );
  var CircleNode = require( 'FRACTIONS_INTRO/intro/view/CircleNode' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CellSceneView = require( 'FRACTIONS_INTRO/intro/view/CellSceneView' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  function CircularView( model, options ) {
    CellSceneView.call( this, model, options );
  }

  fractionsIntro.register( 'CircularView', CircularView );

  return inherit( CellSceneView, CircularView, {
    /**
     * create a circular container node that comprises a circle divided into cells.
     * @param {Container} container
     * @param {Function} cellDownCallback
     * @returns {CircularContainerNode}
     * @public
     */
    createContainerNode: function( container, cellDownCallback ) {
      return new CircularContainerNode( container, cellDownCallback );
    },

    /**
     * create a circular piece node
     * @param {Piece} piece
     * @param {Function} finishedAnimatingCallback
     * @param {Function} droppedCallback
     * @returns {CircularPieceNode}
     * @public
     */
    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new CircularPieceNode( piece, finishedAnimatingCallback, droppedCallback );
    },

    /**
     * Creates a circular Cell node
     *
     * @param {number} denominator
     * @param {number} index
     * @param {Object} [options]
     * @returns {CircleNode}
     * @public
     */
    createCellNode: function( denominator, index, options ) {
      return new CircleNode( denominator, index, options );
    }
  } );
} );
