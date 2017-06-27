// Copyright 2017, University of Colorado Boulder

/**
 * create a piece to drag or animate to a container
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Easing = require( 'TWIXT/Easing' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PieceNode = require( 'FRACTIONS_INTRO/intro/view/PieceNode' );
  var RectangleNode = require( 'FRACTIONS_INTRO/intro/view/RectangleNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Piece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {Piece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {Piece} )
   * @param {Object} [options]
   */
  function RectangularPieceNode( piece, finishedAnimatingCallback, droppedCallback, options ) {

    // @private {Piece}
    this.piece = piece;

    // @private {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    // @private TODO note more than just node, has midpointOffset variable
    options = _.extend( options, { dropShadow: true } );
    this.graphic = new RectangleNode( piece.denominator, options );

    PieceNode.call( this, piece, finishedAnimatingCallback, droppedCallback, {
      graphic: this.graphic
    } );

  }

  fractionsIntro.register( 'RectangularPieceNode', RectangularPieceNode );

  return inherit( Node, RectangularPieceNode, {

    /**
     *  Returns midpoint of rectangular piece
     *
     * @returns {Vector2}
     * @public
     */
    getMidpoint: function() {
      return this.localToParentPoint( this.graphic.midpointOffset );
    },

    /**
     * Sets midpoint of rectangular piece
     *
     * @param {Vector2} midpoint
     * @private
     */
    setMidpoint: function( midpoint ) {
      this.translation = this.translation.plus( midpoint.minus( this.localToParentPoint( this.graphic.midpointOffset ) ) );
    },

    /**
     * Steps piece through multiple small animations as it approaches its destination cell
     *
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      if ( this.isUserControlled ) {
        return;
      }

      // Smaller animations are somewhat faster
      this.ratio = Math.min( 1, this.ratio + dt * 20 / Math.sqrt( this.originProperty.value.distance( this.destinationProperty.value ) ) );
      if ( this.ratio === 1 ) {
        this.finishedAnimatingCallback();
      }
      else {
        var easedRatio = Easing.QUADRATIC_IN_OUT.value( this.ratio );
        this.setMidpoint( this.originProperty.value.blend( this.destinationProperty.value, easedRatio ) );
      }
    },

    /**
     * Placeholder for a method which orients the piece as it approaches its destination
     *
     * @param {Cell} closestCell
     * @param {number} dt
     * @public
     */
    orient: function( closestCell, dt ) {

    },

    /**
     * Interrupts all input on rectangular pieces, disposes of those pieces
     * @public
     */
    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
