// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
  var Easing = require( 'TWIXT/Easing' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PieceNode = require( 'FRACTIONS_INTRO/intro/view/PieceNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: there is a lot of duplication here
   *
   * @param {Piece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {Piece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {Piece} )
   */
  function CakePieceNode( piece, finishedAnimatingCallback, droppedCallback ) {

    // @private TODO note more than just node, has midpointOffset variable
    this.graphic = new CakeNode( piece.denominator, 0 );

    // cake specific
    var originCell = piece.originCell;
    if ( originCell ) {
      this.graphic.setCakeIndex( originCell.index );
    }
    // cake specific
    var destinationCell = piece.destinationCell;
    if ( destinationCell ) {
      this.graphic.setCakeIndex( destinationCell.index );
    }

    PieceNode.call( this, piece, finishedAnimatingCallback, droppedCallback, {
      graphic: this.graphic
    } );
  }

  fractionsIntro.register( 'CakePieceNode', CakePieceNode );

  return inherit( Node, CakePieceNode, {
    /**
     * @returns {Vector2}
     * @public
     */
    getMidpoint: function() {
      return this.localToParentPoint( this.graphic.midpointOffset );
    },

    /**
     * @param {Vector2} midpoint
     * @public
     */
    setMidpoint: function( midpoint ) {
      this.translation = this.translation.plus( midpoint.minus( this.localToParentPoint( this.graphic.midpointOffset ) ) );
    },
    /**
     * Steps forward in time.
     * @param {number} dt - in seconds
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
     * orients the piece to fit the cell
     *
     * @param {Cell} closestCell
     * @param {number} dt - in seconds
     * @public
     */
    orient: function( closestCell, dt ) {
      var midpoint = this.getMidpoint();
      this.graphic.setCakeIndex( closestCell.index );
      this.setMidpoint( midpoint );
    }
  } );
} );
