// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Container = require( 'FRACTIONS_INTRO/model/Container' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );

  /**
   * @constructor
   * @extends {Object}
   */
  function ContainerSet() {
    this.containers = _.range( 0, ProtoConstants.MAX_RANGE ).map( function() {
      return new Container();
    } );
  }

  fractionsIntro.register( 'ContainerSet', ContainerSet );

  return inherit( Object, ContainerSet );
} );
