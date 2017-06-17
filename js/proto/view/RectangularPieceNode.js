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
  var Easing = require( 'TWIXT/Easing' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RectangleNode = require( 'FRACTIONS_INTRO/proto/view/RectangleNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  var ANIMATION_DURATION = 0.5;

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {ProtoPiece} piece
   * @param {function} finishedAnimatingCallback - Called as function( {ProtoPiece} ) with the piece to finish animating.
   * @param {function} droppedCallback - Called as function( {ProtoPiece} )
   */
  function RectangularPieceNode( piece, finishedAnimatingCallback, droppedCallback ) {
    var self = this;

    // @private {ProtoPiece}
    this.piece = piece;

    // @private {function}
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    Node.call( this, {
      children: [
        new RectangleNode( piece.denominator )
      ]
    } );

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    // @private {Property.<boolean>}
    this.isUserControlledProperty = new BooleanProperty( false );

    // @private {number} - Animation progress, from 0 to 1.
    this.ratio = 0;

    this.originProperty.lazyLink( function( origin ) {
      self.ratio = 0;
      self.center = origin;
    } );
    this.destinationProperty.lazyLink( function() {
      self.ratio = 0;
    } );

    // @public
    this.dragListener = new SimpleDragHandler( {
      translate: function( options ) {
        self.translate( options.delta );
      },
      end: function() {
        droppedCallback( piece );
      }
    } );
  }

  fractionsIntro.register( 'RectangularPieceNode', RectangularPieceNode );

  return inherit( Node, RectangularPieceNode, {
    step: function( dt ) {
      if ( this.isUserControlledProperty.value ) {
        return;
      }

      this.ratio = Math.min( 1, this.ratio + dt / ANIMATION_DURATION );
      if ( this.ratio === 1 ) {
        this.finishedAnimatingCallback();
      }
      else {
        var easedRatio = Easing.QUADRATIC_IN_OUT.value( this.ratio );
        this.center = this.originProperty.value.blend( this.destinationProperty.value, easedRatio );
      }
    },

    dispose: function() {
      this.interruptSubtreeInput();

      Node.prototype.dispose.call( this );
    }
  } );
} );
