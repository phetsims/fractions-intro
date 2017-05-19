// Copyright 2013-2017, University of Colorado Boulder

/**
 * Spinner that shows and allows the user to change the maximum for the sim between 1-6.
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
   * @param {Property.<number>} maxProperty
   * @param {Object} [options]
   * @constructor
   */
  function MaxSpinner( maxProperty, options ) {

    options = _.extend( {

      fill: 'black'
    }, options );

    var font = new PhetFont( { size: 36 } );

    var maxUpEnabledProperty = new DerivedProperty(
      [ maxProperty ],
      function( maxNumberOfUnits ) { return maxNumberOfUnits < IntroConstants.MAX_RANGE.max; } );
    var maxDownEnabledProperty = new DerivedProperty(
      [ maxProperty ],
      function( maxNumberOfUnits ) { return maxNumberOfUnits > IntroConstants.MAX_RANGE.min; } );

    // creates spinner that is linked to the numeratorProperty
    var maxValueSpinner = new UpDownSpinner( maxProperty, maxUpEnabledProperty, maxDownEnabledProperty );

    // creates the maxValueText
    var maxValueText = new Text( maxProperty.get(), { font: font, fill: options.fill } );
    maxProperty.link( function( value ) {
      maxValueText.text = value;

      // moves maxValueText to the right of the maxValueSpinner
      maxValueText.right = maxValueSpinner.left - 5;

      // centers maxValueText vertically with maxValueSpinner
      maxValueText.centerY = maxValueSpinner.centerY;
    } );

    var maxLabelText = new Text( maxString, {
      font: font,
      fill: options.fill,
      bottom: maxValueSpinner.top,
      left: maxValueText.left
    } );

    // Specify the children to be rendered with this node
    options.children = [ maxValueSpinner, maxValueText, maxLabelText ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'MaxSpinner', MaxSpinner );

  return inherit( Node, MaxSpinner );
} );