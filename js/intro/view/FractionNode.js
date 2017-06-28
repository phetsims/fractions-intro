// Copyright 2013-2017, University of Colorado Boulder
/**
 * Node for the pure fraction with numerator/denominator
 *
 * @author Michael Moorer (Berea College)
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {

  'use strict';
  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @extends {VBox}
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionNode( numeratorProperty, denominatorProperty, options ) {

    options = _.extend( {
      color: 'black',
      expression: 'improper'
    }, options );

    var self = this;
    HBox.call( this, _.extend( options, {
      spacing: 2
    } ) );

    var numeratorText = null;
    var denominatorText = null;

    // add tha ability to put a mixed fraction on the screen
    if ( options.expression === 'improper' ) {
      numeratorText = new Text( '', {
        font: options.font
      } );
      numeratorProperty.linkAttribute( numeratorText, 'text' );

      denominatorText = new Text( '', {
        font: options.font
      } );
      denominatorProperty.linkAttribute( denominatorText, 'text' );

      var line = new Line( 0, 0, options.dividingLineLength, 0, {
        stroke: options.color,
        lineWidth: options.dividingLineWidth,
        lineCap: 'round'
      } );
      options.children = [ new VBox( {
        children: [ numeratorText, line, denominatorText ]
      } ) ];
      self.mutate( options );
    }
    else if ( options.expression === 'mixed' ) {

      // to prevent infinite recurrent calls
      options = _.extend( options, {
        expression: 'improper'
      } );

      var updateMixedNumber = Property.multilink( [ numeratorProperty, denominatorProperty ], function( numerator, denominator ) {
        var wholeNumber = Math.floor( numerator / denominator );
        var wholeNumberText = new Text( wholeNumber, {
          font: options.font
        } );

        var remainder = numerator % denominator;
        if ( remainder === 0 ) {

          // must be a whole number 0-6
          options.children = [ wholeNumberText ];
        }
        else if ( wholeNumber === 0 ) {

          //not mixed, whole number = 0 fraction > 0
          options.children = [ new FractionNode( numeratorProperty, denominatorProperty, options ) ];
        }
        else {

          // will be a mixed number
          options.children = [ wholeNumberText, new FractionNode( new NumberProperty( remainder ), denominatorProperty, {
            dividingLineLength: options.dividingLineLength,
            font: options.font
          } ) ];
        }
        self.mutate( options );
      } );
    }

    this.disposeMixedNumberMultiLink = function() {
      Property.unmultilink( updateMixedNumber );
    };
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( HBox, FractionNode, {
    dispose: function() {
      this.disposeMixedNumberMultiLink();
      Node.prototype.dispose.call( this );
    }
  } );

} );