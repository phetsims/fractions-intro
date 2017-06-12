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
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
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

    // Enables or Disables number spinner depending upon the range
    var numeratorRangeProperty = new Property( new RangeWithValue( 0, denominatorProperty.value * maxProperty.value, 0 ) );

    var denominatorRangeProperty = new Property( IntroConstants.DENOMINATOR_RANGE );

    // update numerator range to be depending upon the max and denominator
    Property.multilink( [ maxProperty, denominatorProperty ], function( max, denominator ) {

      numeratorRangeProperty.value = new RangeWithValue( 0, denominator * max, 0 );

    } );

    // creates spinner that is linked to the numeratorProperty
    var numeratorSpinner = new NumberSpinner( numeratorProperty, numeratorRangeProperty, {
      backgroundStroke: 'white',
      arrowsScale: 0.5, font: new PhetFont( 112 ), arrowButtonFill: 'yellow'
    } );

    // creates spinner that is linked to the denominatorProperty
    var denominatorSpinner = new NumberSpinner( denominatorProperty, denominatorRangeProperty, {
      backgroundStroke: 'white', arrowsScale: 0.5,
      font: new PhetFont( 112 ), arrowButtonFill: 'yellow'
    } );

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