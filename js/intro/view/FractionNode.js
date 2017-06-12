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
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionNode( numeratorProperty, denominatorProperty, options ) {

    options = _.extend( {
      color: 'black',
      font: new PhetFont( { size: 110 } ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    // creates a division line beneath numerator
    var line = new Line( 0, 0, options.dividingLineLength, 0, {
      lineWidth: options.dividingLineWidth,
      lineCap: 'round',
      stroke: options.color
    } );

    // creates numerator node
    var numeratorNode = new Text( numeratorProperty.get(), {
      font: options.font,
      fill: options.color
    } );

    // creates denominator node
    var denominatorNode = new Text( denominatorProperty.get(), {
      font: options.font,
      fill: options.color
    } );

    // centers the numeratorNode horizontally between the division line
    numeratorProperty.link( function( value ) {
      numeratorNode.text = value;
    } );

    // centers the denominatorNode horizontally between the division line
    denominatorProperty.link( function( value ) {
      denominatorNode.text = value;
    } );

    // Specify the children to be rendered with this node

    VBox.call( this, _.extend( options, {
      spacing: 2,
      children: [ numeratorNode, line, denominatorNode ]
    } ) );
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( VBox, FractionNode );

} );