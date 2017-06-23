// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
  var Property = require( 'AXON/Property' );
  var RectangleNode = require( 'FRACTIONS_INTRO/intro/view/RectangleNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {Piece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {Piece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {Piece} )
   */
  function RectangularPieceNode( piece, finishedAnimatingCallback, droppedCallback ) {
    var self = this;

    // @private {Piece}
    this.piece = piece;

    // @private {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    // @private TODO note more than just node, has midpointOffset variable
    this.graphic = new RectangleNode( piece.denominator, { dropShadow: true } );

    Node.call( this, {
      children: [
        this.graphic
      ]
    } );

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    // @public {boolean}
    this.isUserControlled = false;

    // @private {number} - Animation progress, from 0 to 1.
    this.ratio = 0;

    this.originProperty.lazyLink( function( origin ) {
      self.ratio = 0;
      self.setMidpoint( origin );
    } );
    this.destinationProperty.lazyLink( function() {
      self.ratio = 0;
    } );

    // @public
    var initialOffset;
    this.dragListener = new SimpleDragHandler( {
      start: function( event ) {
        initialOffset = self.getMidpoint().minus( self.globalToParentPoint( event.pointer.point ) );
      },
      drag: function( event ) {
        self.setMidpoint( self.globalToParentPoint( event.pointer.point ).plus( initialOffset ) );
      },
      end: function() {
        droppedCallback( piece );
      }
    } );
  }

  fractionsIntro.register( 'RectangularPieceNode', RectangularPieceNode );

  return inherit( Node, RectangularPieceNode, {

    /**
     *  Returns midpoint of rectangular piece
     *
     * @returns {Vector2}
     */
    getMidpoint: function() {
      return this.localToParentPoint( this.graphic.midpointOffset );
    },

    /**
     * Sets midpoint of rectangular piece
     *
     * @param {Vector2} midpoint
     */
    setMidpoint: function( midpoint ) {
      this.translation = this.translation.plus( midpoint.minus( this.localToParentPoint( this.graphic.midpointOffset ) ) );
    },

    /**
     * Steps piece through multiple small animations as it approaches its destination cell
     *
     * @param {number} dt
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
     * @param closestCell
     * @param dt
     */
    orient: function( closestCell, dt ) {

    },

    /**
     * Interrupts all input on rectangular pieces, disposes of those pieces
     */
    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
