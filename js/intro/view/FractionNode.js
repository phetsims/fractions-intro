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
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
      font: new PhetFont( 110 ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    var numeratorText = new Text( '', {
      font: options.font
    } );
    numeratorProperty.linkAttribute( numeratorText, 'text' );

    var denominatorText = new Text( '', {
      font: options.font
    } );
    denominatorProperty.linkAttribute( denominatorText, 'text' );

    var line = new Line( 0, 0, options.dividingLineLength, 0, {
      stroke: options.color,
      lineWidth: options.dividingLineWidth,
      lineCap: 'round'
    } );

    VBox.call( this, _.extend( options, {
      spacing: 2,
      children: [ numeratorText, line, denominatorText ]
    } ) );
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( VBox, FractionNode );

} );