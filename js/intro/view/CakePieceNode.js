// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
  var Easing = require( 'TWIXT/Easing' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

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
    var self = this;

    // @private {Piece}
    this.piece = piece;

    // @private {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    // @private TODO note more than just node, has midpointOffset variable
    this.graphic = new CakeNode( piece.denominator, 0 );

    var originCell = piece.originCellProperty.value;
    if ( originCell ) {
      this.graphic.setCakeIndex( originCell.index );
    }

    var destinationCell = piece.destinationCellProperty.value;
    if ( destinationCell ) {
      this.graphic.setCakeIndex( destinationCell.index );
    }

    Node.call( this, { children: [ this.graphic ] } );

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    // @private {Property.<boolean>}
    this.isUserControlledProperty = new BooleanProperty( false );

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
      if ( this.isUserControlledProperty.value ) {
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
     * @param {Cell} closestCell
     * @param {number} dt - in seconds
     * @public
     */
    orient: function( closestCell, dt ) {
      var midpoint = this.getMidpoint();
      this.graphic.setCakeIndex( closestCell.index );
      this.setMidpoint( midpoint );
    },

    /**
     * @public
     */
    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
