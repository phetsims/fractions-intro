// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var ProtoContainer = require( 'FRACTIONS_INTRO/proto/model/ProtoContainer' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   * @extends {Object}
   */
  function ProtoModel() {
    // @public {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<number>}
    this.denominatorProperty = new NumberProperty( 1 );

    // @public {Property.<number>}
    this.maxProperty = new NumberProperty( 1 );

    // @public {ObservableArray.<ProtoContainer>}
    this.containers = new ObservableArray();

    var initialContainer = new ProtoContainer();
    initialContainer.addCells( this.denominatorProperty.value );
    this.containers.push( initialContainer );

    this.numeratorProperty.lazyLink( this.onNumeratorChange.bind( this ) );
    this.denominatorProperty.lazyLink( this.onDenominatorChange.bind( this ) );
    this.maxProperty.lazyLink( this.onMaxChange.bind( this ) );
  }

  fractionsIntro.register( 'ProtoModel', ProtoModel );

  return inherit( Object, ProtoModel, {
    fillNextCell: function() {
      for ( var i = 0; i < this.containers.length; i++ ) {
        var container = this.containers.get( i );
        if ( container.hasEmptyCell() ) {
          container.fillNextCell();
          return;
        }
      }
    },

    emptyNextCell: function() {
      for ( var i = this.containers.length - 1; i >= 0; i-- ) {
        var container = this.containers.get( i );
        if ( container.hasFilledCell() ) {
          container.emptyNextCell();
          return;
        }
      }
    },

    onMaxChange: function( newMax, oldMax ) {
      // no change needed?
    },

    onNumeratorChange: function( newNumerator, oldNumerator ) {
      var self = this;
      var change = Math.abs( newNumerator - oldNumerator );
      _.times( change, function() {
        if ( newNumerator > oldNumerator ) {
          self.fillNextCell();
        }
        else {
          self.emptyNextCell();
        }
      } );
    },

    onDenominatorChange: function( newDenominator, oldDenominator ) {
      var self = this;
      var change = Math.abs( newDenominator - oldDenominator );
      if ( newDenominator > oldDenominator ) {
        this.containers.forEach( function( container ) {
          container.addCells( change );
        } );
      }
      else {
        var removedCount = 0;
        this.containers.forEach( function( container ) {
          removedCount += container.removeCells( change );
        } );
        _.times( removedCount, function() {
          self.fillNextCell();
        } );
      }
    },

    /**
     * Resets the entire model.
     * @public
     */
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
      this.maxProperty.reset();
    }
  } );
} );
