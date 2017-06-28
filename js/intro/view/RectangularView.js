// Copyright 2017, University of Colorado Boulder

/**
 * Handles the creation of Rectangular pieces and containers
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
  var RectangleNode = require( 'FRACTIONS_INTRO/intro/view/RectangleNode' );

  /**
   * @constructor
   * @extends {CellSceneView}
   *
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  function RectangularView( model, options ) {
    this.options = options;
    CellSceneView.call( this, model, options );
  }

  fractionsIntro.register( 'RectangularView', RectangularView );

  return inherit( CellSceneView, RectangularView, {

    /**
     * Creates a Container Node with a specific callback function
     *
     * @param {Node} container
     * @param {function} cellDownCallback
     * @returns {RectangularContainerNode}
     * @public
     */
    createContainerNode: function( container, cellDownCallback ) {
      return new RectangularContainerNode( container, cellDownCallback, {
        rectangle_orientation: this.options.rectangle_orientation
      } );
    },
    /**
     * Creates a piece Node with a specific callback function and finished animation callback
     *
     * @param {Node} piece
     * @param {function} finishedAnimatingCallback
     * @param {function} droppedCallback
     * @returns {RectangularPieceNode}
     * @public
     */
    createPieceNode: function( piece, finishedAnimatingCallback, droppedCallback ) {
      return new RectangularPieceNode( piece, finishedAnimatingCallback, droppedCallback, this.options );
    },

    /**
     * Creates a rectangular Cell
     *
     * @param {number} denominator
     * @param {number} index
     * @param {Object} [options]
     * @returns {RectangleNode}
     * @public
     */
    createCellNode: function( denominator, index, options ) {
      options = _.extend( this.options, options,{dropShadow:false} );
      return new RectangleNode( denominator, options );
    }

  } );
} );
