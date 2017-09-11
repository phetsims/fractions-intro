// Copyright 2017, University of Colorado Boulder

/**
 * Scenery Node that displays a spinner with the label 'Max' and displays the max number
 *
 * @author Vincent Davis (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RoundSpinner = require( 'FRACTIONS_INTRO/intro/view/RoundSpinner' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var maxString = require( 'string!FRACTIONS_INTRO/max' );

  /**
   * @extends {Node}
   *
   * @param {Property.<number>} maxProperty
   * @param {Object} [options]
   * @constructor
   */
  function MaxSpinner( maxProperty, options ) {

    options = _.extend( {
      font: new PhetFont( 32 ),
      radius: 11, // radius of the button
      spacing: 3 // spacing for spinner
    }, options );

    var maxUpEnabledProperty = new DerivedProperty( [ maxProperty ],
      function( maxNumberOfUnits ) {
        return maxNumberOfUnits < IntroConstants.MAX_RANGE.max;
      } );
    var maxDownEnabledProperty = new DerivedProperty( [ maxProperty ],
      function( maxNumberOfUnits ) {
        return maxNumberOfUnits > IntroConstants.MAX_RANGE.min;
      } );

    var maxUpButtonListener = function() {maxProperty.value++;};
    var maxDownButtonListener = function() {maxProperty.value--;};

    // creates spinner that is linked to the maxProperty
    var maxValueSpinner = new RoundSpinner( maxUpButtonListener, maxDownButtonListener,
      maxUpEnabledProperty, maxDownEnabledProperty, {
        radius: options.radius,
        spacing: options.spacing
      } );

    // creates the maxValueText
    var maxValueText = new Text( maxProperty.value, { font: options.font } );

    maxProperty.link( function( value ) {
      maxValueText.text = value;

      // moves maxValueText to the right of the maxValueSpinner
      maxValueText.right = maxValueSpinner.left - 10;

      // centers maxValueText vertically with maxValueSpinner
      maxValueText.centerY = maxValueSpinner.centerY;
    } );

    var maxLabelText = new Text( maxString, {
      font: options.font,
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