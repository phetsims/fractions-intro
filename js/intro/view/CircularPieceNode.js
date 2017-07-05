// Copyright 2017, University of Colorado Boulder

/**
 * make the pieces for the circle and handle the animation
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var CircleNode = require( 'FRACTIONS_INTRO/intro/view/CircleNode' );
  var Easing = require( 'TWIXT/Easing' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PieceNode = require( 'FRACTIONS_INTRO/intro/view/PieceNode' );

  /**
   * @constructor
   * @extends {Node}
   *
   * TODO: dedup with RectangularPieceNode
   *
   * @param {Piece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {Piece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {Piece} )
   */
  function CircularPieceNode( piece, finishedAnimatingCallback, droppedCallback ) {

    // @private TODO note more than just node, has midpointOffset variable
    this.graphic = new CircleNode( piece.denominator, 0 );

    PieceNode.call( this, piece, finishedAnimatingCallback, droppedCallback, {
      graphic: this.graphic
    } );

    // circle specific
    var originCell = piece.originCell;
    if ( originCell ) {
      this.rotation = originCell.index * 2 * Math.PI / this.piece.denominator;
    }
  }

  fractionsIntro.register( 'CircularPieceNode', CircularPieceNode );

  return inherit( PieceNode, CircularPieceNode, {
    /**
     * forwards the position of this node in time
     * @param {number} dt - time step in seconds
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
        // rotate before centering
        var destinationCell = this.piece.destinationCell;

        var originRotation = this.originRotation;
        var targetRotation = destinationCell ? destinationCell.index * 2 * Math.PI / this.piece.denominator : 0;

        // Hack to get closest rotation AND deduplicate this code
        if ( targetRotation - originRotation > Math.PI ) {
          targetRotation -= 2 * Math.PI;
        }
        this.rotation = ( 1 - this.ratio ) * this.originRotation + this.ratio * targetRotation;

        var easedRatio = Easing.QUADRATIC_IN_OUT.value( this.ratio );
        this.setMidpoint( this.originProperty.value.blend( this.destinationProperty.value, easedRatio ) );
      }
    },

    /**
     * orients the piece to fit the cell
     * @param {Cell} closestCell
     * @param {number} dt
     * @public
     */
    orient: function( closestCell, dt ) {
      var originRotation = this.rotation;
      var targetRotation = closestCell.index * 2 * Math.PI / this.piece.denominator;

      // Hack to get closest rotation AND deduplicate this code
      if ( targetRotation - originRotation > Math.PI ) {
        targetRotation -= 2 * Math.PI;
      }

      var midpoint = this.getMidpoint();

      var rotationAmount = 5 * dt;
      if ( targetRotation > originRotation ) {
        this.rotation = Math.min( targetRotation, originRotation + rotationAmount );
      }
      else if ( targetRotation < originRotation ) {
        this.rotation = Math.max( targetRotation, originRotation - rotationAmount );
      }

      this.setMidpoint( midpoint );
    }
  } );
} );
