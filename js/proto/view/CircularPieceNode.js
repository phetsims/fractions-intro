// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var CircleNode = require( 'FRACTIONS_INTRO/proto/view/CircleNode' );
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
   * TODO: dedup with RectangularPieceNode
   *
   * @param {ProtoPiece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {ProtoPiece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {ProtoPiece} )
   */
  function CircularPieceNode( piece, finishedAnimatingCallback, droppedCallback ) {
    var self = this;

    // @private {ProtoPiece}
    this.piece = piece;

    // @private {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    // @private TODO note more than just node, has midpointOffset variable
    this.graphic = new CircleNode( piece.denominator, 0 );

    Node.call( this, {
      children: [
        this.graphic
      ]
    } );

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    //circle-specific
    this.originRotation = 0;

    // @private {Property.<boolean>}
    this.isUserControlledProperty = new BooleanProperty( false );

    // @private {number} - Animation progress, from 0 to 1.
    this.ratio = 0;

    var originCell = piece.originCellProperty.value;
    if ( originCell ) {
      this.rotation = originCell.index * 2 * Math.PI / this.piece.denominator;
    }

    this.originProperty.lazyLink( function( origin ) {
      self.ratio = 0;
      self.setMidpoint( origin );
      self.originRotation = self.rotation;
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

  fractionsIntro.register( 'CircularPieceNode', CircularPieceNode );

  return inherit( Node, CircularPieceNode, {
    getMidpoint: function() {
      return this.localToParentPoint( this.graphic.midpointOffset );
    },

    setMidpoint: function( midpoint ) {
      this.translation = this.translation.plus( midpoint.minus( this.localToParentPoint( this.graphic.midpointOffset ) ) );
    },

    step: function( dt ) {
      if ( this.isUserControlledProperty.value ) {
        // TODO: rotate to the closest

        return;
      }

      // Smaller animations are somewhat faster
      this.ratio = Math.min( 1, this.ratio + dt * 20 / Math.sqrt( this.originProperty.value.distance( this.destinationProperty.value ) ) );
      if ( this.ratio === 1 ) {
        this.finishedAnimatingCallback();
      }
      else {
        // rotate before centering
        var destinationCell = this.piece.destinationCellProperty.value;

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
    },

    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
