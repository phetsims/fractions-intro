// Copyright 2017, University of Colorado Boulder

/**
 * handle the animation for the piece
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
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
   * @param {Piece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {Piece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {Piece} )
   * @param {Object} [options]
   */
  function PieceNode( piece, finishedAnimatingCallback, droppedCallback, options ) {
    var self = this;

    options = _.extend( {
      graphic: new Node()
    }, options );

    // @private {Piece}
    this.piece = piece;

    // this will be created by the <representation>PieceNode itself
    // @private
    this.graphic = options.graphic;

    // @public (read-only) {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    Node.call( this, {
      children: [
        this.graphic
      ]
    } );

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    // @public <boolean>
    this.isUserControlled = false;

    // @private {number} - Animation progress, from 0 to 1.
    this.ratio = 0;

    this.originProperty.lazyLink( function( origin ) {
      self.ratio = 0;
      self.setMidpoint( origin );

      // circle specific
      //TODO : fixed for when not a circle
      if ( self.graphic.getCircleRotation ) {
        self.originRotation = self.graphic.getCircleRotation();
      }
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

  fractionsIntro.register( 'PieceNode', PieceNode );

  return inherit( Node, PieceNode, {

    /**
     * gets the mid point of this piece
     * @returns {Vector2}
     * @public
     */
    getMidpoint: function() {
      return this.localToParentPoint( this.graphic.midpointOffset );
    },

    /**
     * sets the midpoint of this piece
     * @param {Vector2} midpoint
     * @private
     */
    setMidpoint: function( midpoint ) {
      this.translation = this.translation.plus( midpoint.minus( this.localToParentPoint( this.graphic.midpointOffset ) ) );
    },

    /**
     * dispose of the links for garbage collection
     * @public
     */
    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
