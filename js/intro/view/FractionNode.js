// Copyright 2013-2017, University of Colorado Boulder

/**
 * Node for the fraction with up/down spinners for numerator/denominator
 *
 * @author Michael Moorer (Berea College)
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxNumberOfUnitsProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionNode( numeratorProperty, denominatorProperty, maxNumberOfUnitsProperty, options ) {

    options = _.extend( {

      fill: 'black',
      // By default the fraction node is interactive, which means it has up/down spinners
      // Those spinners can be removed if the fraction node will be used as a label for underneath the number line
      interactive: true
    }, options );

    var font = new PhetFont( { size: 84 } );
    var numeratorNode = new Text( numeratorProperty.get(), { font: font, fill: options.fill } );

    // creates a division line beneath numerator
    var line = new Line( 0, 0, 80, 0, { lineWidth: 4, stroke: options.fill } );

    // centers the numeratorNode horizontally between the division line
    numeratorProperty.link( function( value ) {
      numeratorNode.text = value + '';
      numeratorNode.centerX = line.centerX;
    } );

    // centers the denominatorNode horizontally between the division line
    var denominatorNode = new Text( denominatorProperty.get(), { font: font, fill: options.fill } );
    denominatorProperty.link( function( value ) {
      denominatorNode.text = value + '';
      denominatorNode.centerX = line.centerX;
    } );

    // alters the position of the numeratorNode and denominatorNode vertically and horizontally
    numeratorNode.mutate( { centerX: line.centerX, bottom: line.bounds.minY - 2 } );
    denominatorNode.mutate( { centerX: line.centerX, top: line.bounds.maxY - 2 } );

    // Enables or Disables Spinners as dependent on numeratorProperty, denominatorProperty, or maxNumberOfUnitsProperty
    if ( options.interactive ) {
      var numeratorUpEnabledProperty = new DerivedProperty(
        [ numeratorProperty, denominatorProperty, maxNumberOfUnitsProperty ],
        function( numerator, denominator, maxNumberOfUnits ) { return numerator < denominator * maxNumberOfUnits; } );
      var numeratorDownEnabledProperty = new DerivedProperty(
        [ numeratorProperty ],
        function( numerator ) { return numerator > 0; } );
      var denominatorUpEnabledProperty = new DerivedProperty(
        [ denominatorProperty ],
        function( denominator ) { return denominator < IntroConstants.DENOMINATOR_RANGE.max; } );
      var denominatorDownEnabledProperty = new DerivedProperty(
        [ numeratorProperty, denominatorProperty, maxNumberOfUnitsProperty ],
        function( numerator, denominator, maxNumberOfUnits ) { return denominator > IntroConstants.DENOMINATOR_RANGE.min && numerator <= (denominator - 1) * maxNumberOfUnits;} );

      // creates spinner that is linked to the numeratorProperty
      var numeratorSpinner = new UpDownSpinner( numeratorProperty, numeratorUpEnabledProperty, numeratorDownEnabledProperty );

      // creates spinner that is linked to the denominatorProperty
      var denominatorSpinner = new UpDownSpinner( denominatorProperty, denominatorUpEnabledProperty, denominatorDownEnabledProperty );

      // Aligns the numeratorSpinner and denominatorSpinner vertically
      var spinnerVBox = new VBox( {
        spacing: 20,
        children: [ numeratorSpinner, denominatorSpinner ],
        left: line.bounds.maxX + 5,
        centerY: line.bounds.centerY
      } );
    }

    // Specify the children to be rendered with this node
    options.children = [ line, numeratorNode, denominatorNode, spinnerVBox ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( Node, FractionNode );
} );