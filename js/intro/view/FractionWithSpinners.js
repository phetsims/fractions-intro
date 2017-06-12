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
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Property.<number>} maxProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionWithSpinners( numeratorProperty, denominatorProperty, maxProperty, options ) {

    options = _.extend( {
      fill: 'black',
      font: new PhetFont( { size: 110 } ),
      dividingLineLength: 150,
      dividingLineWidth: 10
    }, options );

    var fractionNode = new FractionNode( numeratorProperty, denominatorProperty );

    // Enables or Disables Spinners as dependent on numeratorProperty, denominatorProperty, or maxProperty
    var numeratorUpEnabledProperty = new DerivedProperty(
      [ numeratorProperty, denominatorProperty, maxProperty ],
      function( numerator, denominator, max ) { return numerator < denominator * max; } );
    var numeratorDownEnabledProperty = new DerivedProperty(
      [ numeratorProperty ],
      function( numerator ) { return numerator > 0; } );
    var denominatorUpEnabledProperty = new DerivedProperty(
      [ denominatorProperty ],
      function( denominator ) { return denominator < IntroConstants.DENOMINATOR_RANGE.max; } );
    var denominatorDownEnabledProperty = new DerivedProperty(
      [ numeratorProperty, denominatorProperty, maxProperty ],
      function( numerator, denominator, max ) { return denominator > IntroConstants.DENOMINATOR_RANGE.min && numerator <= (denominator - 1) * max;} );


    // creates spinner that is linked to the numeratorProperty
    var numeratorSpinner = new UpDownSpinner( numeratorProperty, numeratorUpEnabledProperty, numeratorDownEnabledProperty );

    // creates spinner that is linked to the denominatorProperty
    var denominatorSpinner = new UpDownSpinner( denominatorProperty, denominatorUpEnabledProperty, denominatorDownEnabledProperty );

    // Aligns the numeratorSpinner and denominatorSpinner vertically
    var spinnerVBox = new VBox( {
      spacing: 50,
      children: [ numeratorSpinner, denominatorSpinner ],
      right: fractionNode.left,
      centerY: fractionNode.centerY
    } );

    // Specify the children to be rendered with this node
    options.children = [ fractionNode, spinnerVBox ];
    Node.call( this, options );
  }

  fractionsIntro.register( 'FractionWithSpinners', FractionWithSpinners );

  return inherit( Node, FractionWithSpinners );
} );