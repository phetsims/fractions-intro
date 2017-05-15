// Copyright 2013-2017, University of Colorado Boulder

/**
 * Spinner that shows and allows the user to change the max number of units for the sim between 1-6.
 *
 * @author Vincent Davis (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );

  // strings
  var maxString = require( 'string!FRACTIONS_INTRO/max' );

  /**
   *
   * @param {Property.<number>} maxNumberOfUnitsProperty
   * @param {Object} [options]
   * @constructor
   */
  function MaxSpinner( maxNumberOfUnitsProperty, options ) {

    options = _.extend( {

      fill: 'black'
    }, options );

    var font = new PhetFont( { size: 36 } );

    var maxUpEnabledProperty = new DerivedProperty(
      [ maxNumberOfUnitsProperty ],
      function( maxNumberOfUnits ) { return maxNumberOfUnits < IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.max; } );
    var maxDownEnabledProperty = new DerivedProperty(
      [ maxNumberOfUnitsProperty ],
      function( maxNumberOfUnits ) { return maxNumberOfUnits > IntroConstants.MAX_NUMBER_OF_UNITS_RANGE.min; } );

    // creates spinner that is linked to the numeratorProperty
    var maxNumberSpinner = new UpDownSpinner( maxNumberOfUnitsProperty, maxUpEnabledProperty, maxDownEnabledProperty );

    // creates the maxNumberOfUnitsText
    var maxNumberOfUnitsText = new Text( maxNumberOfUnitsProperty.get(), { font: font, fill: options.fill } );
    maxNumberOfUnitsProperty.link( function( value ) {
      maxNumberOfUnitsText.text = value + '';

      // moves maxNumberOfUnitsText to the right of the maxNumberSpinner
      maxNumberOfUnitsText.right = maxNumberSpinner.left - 5;

      // centers maxNumberOfUnitsText vertically with maxNumberSpinner
      maxNumberOfUnitsText.centerY = maxNumberSpinner.centerY;
    } );

    var maxText = new Text( maxString, {
      font: font,
      fill: options.fill,
      bottom: maxNumberSpinner.top,
      left: maxNumberOfUnitsText.left
    } );

    // Specify the children to be rendered with this node
    options.children = [ maxNumberSpinner, maxNumberOfUnitsText, maxText ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'MaxSpinner', MaxSpinner );

  return inherit( Node, MaxSpinner );
} );