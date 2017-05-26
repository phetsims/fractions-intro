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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionNode( numeratorProperty, denominatorProperty, options ) {

    options = _.extend( {
      fill: 'black',
      font: new PhetFont( { size: 110 } ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    // creates a division line beneath numerator
    var line = new Line( 0, 0, options.dividingLineLength, 0, {
      lineWidth: options.dividingLineWidth, lineCap: 'round', stroke: options.fill
    } );

    // creates numerator node
    var numeratorNode = new Text( numeratorProperty.get(), {
      font: options.font, fill: options.fill,
      centerX: line.centerX, bottom: line.bounds.minY - 2
    } );

    // creates denominator node
    var denominatorNode = new Text( denominatorProperty.get(), {
      font: options.font, fill: options.fill,
      centerX: line.centerX, top: line.bounds.maxY + 2
    } );

    // centers the numeratorNode horizontally between the division line
    numeratorProperty.link( function( value ) {
      numeratorNode.text = value;
      numeratorNode.centerX = line.centerX;
    } );

    // centers the denominatorNode horizontally between the division line
    denominatorProperty.link( function( value ) {
      denominatorNode.text = value;
      denominatorNode.centerX = line.centerX;
    } );

    // Specify the children to be rendered with this node
    options.children = [ line, numeratorNode, denominatorNode ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( Node, FractionNode );

} );