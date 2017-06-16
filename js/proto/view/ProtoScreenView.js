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
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @constructor
   * @extends {ScreenView}
   *
   * @param {ProtoModel} model
   */
  function ProtoScreenView( model ) {

    ScreenView.call( this );

    // @private {ProtoModel}
    this.model = model;

    // Reset all button
    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } ) );
  }

  fractionsIntro.register( 'ProtoScreenView', ProtoScreenView );

  return inherit( ScreenView, ProtoScreenView );
} );
