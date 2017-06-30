// Copyright 2017, University of Colorado Boulder

/**
 * create a piece to drag or animate to a container
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
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
   * TODO: dedup if necessary?
   *
   * @param {number} denominator
   * @param {function} finishedAnimatingCallback - Called as function( {BeakerPieceNode} )
   * @param {function} droppedCallback - Called as function( {BeakerPieceNode} )
   */
  function BeakerPieceNode( denominator, finishedAnimatingCallback, droppedCallback ) {
    BeakerNode.call( this, 1, denominator );

    var self = this;

    // @private
    this.finishedAnimatingCallback = finishedAnimatingCallback;

    // @public {Property.<Vector2>}
    this.originProperty = new Property( Vector2.ZERO );
    this.destinationProperty = new Property( Vector2.ZERO );

    // @public {boolean}
    this.isUserControlled = false;

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
    var initialOffset;
    this.dragListener = new SimpleDragHandler( {
      start: function( event ) {
        initialOffset = self.getCenter().minus( self.globalToParentPoint( event.pointer.point ) );
      },
      drag: function( event ) {
        self.setCenter( self.globalToParentPoint( event.pointer.point ).plus( initialOffset ) );
      },
      end: function() {
        droppedCallback( self );
      }
    } );
  }

  fractionsIntro.register( 'BeakerPieceNode', BeakerPieceNode );

  return inherit( Node, BeakerPieceNode, {

    /**
     * Steps forward in time.
     *
     * @param {number} dt - timeStep in seconds
     * @public
     */
    step: function( dt ) {
      if ( this.isUserControlled ) {
        return;
      }

      // Smaller animations are somewhat faster
      this.ratio = Math.min( 1, this.ratio + dt * 20 / Math.sqrt( this.originProperty.value.distance( this.destinationProperty.value ) ) );
      if ( this.ratio === 1 ) {
        this.finishedAnimatingCallback( this );
      }
      else {
        var easedRatio = Easing.QUADRATIC_IN_OUT.value( this.ratio );
        this.setCenter( this.originProperty.value.blend( this.destinationProperty.value, easedRatio ) );
      }
    }
  } );
} );
