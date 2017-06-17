// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProtoSceneView = require( 'FRACTIONS_INTRO/proto/view/ProtoSceneView' );
  var RectangularContainerNode = require( 'FRACTIONS_INTRO/proto/view/RectangularContainerNode' );
  var RectangularPieceNode = require( 'FRACTIONS_INTRO/proto/view/RectangularPieceNode' );

  /**
   * @constructor
   * @extends {ProtoSceneView}
   *
   * @param {ProtoModel} model
   */
  function RectangularView( model ) {
    ProtoSceneView.call( this, model );
  }

  fractionsIntro.register( 'RectangularView', RectangularView );

  return inherit( ProtoSceneView, RectangularView, {
    createContainerNode: function( container ) {
      return new RectangularContainerNode( container );
    },

    createPieceNode: function( piece, finishedAnimatingCallback ) {
      return new RectangularPieceNode( piece, finishedAnimatingCallback );
    }
  } );
} );
