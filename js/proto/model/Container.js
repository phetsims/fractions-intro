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
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   * @extends {Object}
   */
  function Container() {
    // @public {ObservableArray.<Cell>}
    this.cells = new ObservableArray();

    // @public {Property.<boolean>}
    this.visibleProperty = new BooleanProperty( false );
  }

  fractionsIntro.register( 'Container', Container );

  return inherit( Object, Container );
} );
