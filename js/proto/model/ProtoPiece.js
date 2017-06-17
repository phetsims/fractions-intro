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
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} denominator
   */
  function ProtoPiece( denominator ) {

    // @private {number}
    this.denominator = denominator;

    // @public {Property.<ProtoCell|null>}
    this.originCellProperty = new Property( null );

    // @public {Property.<ProtoCell|null>}
    this.destinationCellProperty = new Property( null );
  }

  fractionsIntro.register( 'ProtoPiece', ProtoPiece );

  return inherit( Object, ProtoPiece );
} );
