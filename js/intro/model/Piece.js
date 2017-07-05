// Copyright 2017, University of Colorado Boulder

/**
 * Represents a floating piece that is not in a cell.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @extends {Object}
   *
   * @param {number} denominator
   */
  function Piece( denominator ) {

    // @private {number} - If the denominator would ever change, this piece would just cease to exist.
    this.denominator = denominator;

    // @public {Cell|null} - Where this piece started
    this.originCell = null;

    // @public {Cell|null} - Where this piece will end up. If set to a cell, it will change the cell
    //                                       appearance when the piece goes away.
    this.destinationCell = null;
  }

  fractionsIntro.register( 'Piece', Piece );

  return inherit( Object, Piece );
} );
