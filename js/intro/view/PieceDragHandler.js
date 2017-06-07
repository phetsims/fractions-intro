// Copyright 2017, University of Colorado Boulder

/**
 * A drag handler for the scenery Piece Node
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Piece = require( 'FRACTIONS_INTRO/intro/model/Piece' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Vector2} centerPosition - centerPosition of the shape
   * @param {ContainerSet} containerSet
   * @param {ObservableArray.<Piece>} pieces
   * @param {Object} [options]
   * @private
   */
  function PieceDragHandler( centerPosition, containerSet, pieces, options ) {

    options = _.extend( {
      startDrag: function() {},
      translate: function() {},
      endDrag: function() {}
    }, options );

    var piece;

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: function() {

        // create a model piece
        piece = new Piece( { position: centerPosition } );

        // add the model piece to the observable array
        pieces.add( piece );

        // TODO: this a very round about way to force an update of the view
        piece.updateCellsEmitter.addListener( function() {
          containerSet.containersEmitter.emit();
        } );

        options.startDrag();
      },

      translate: function( translationParams ) {
        piece.positionProperty.value = piece.positionProperty.value.plus( translationParams.delta );

        options.translate();
      },

      end: function() {

        if ( containerSet.getEmptyCellsCount() > 0 ) {
          var destinationCell = containerSet.getClosestEmptyCell( piece.positionProperty.value );
          if ( destinationCell.boundsProperty.value.containsPoint( piece.positionProperty.value ) ) {
            piece.cellToProperty.value = destinationCell;
          }
          else {
            piece.animateToAndFrom( piece.positionProperty.value, IntroConstants.BUCKET_POSITION );
          }
        }
        else {
          piece.animateToAndFrom( piece.positionProperty.value, IntroConstants.BUCKET_POSITION );
        }

        piece = null;

        options.endDrag();
      }
    } );
  }

  fractionsIntro.register( 'PieceDragHandler', PieceDragHandler );

  return inherit( SimpleDragHandler, PieceDragHandler );
} );
