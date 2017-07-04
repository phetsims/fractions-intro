// Copyright 2013-2017, University of Colorado Boulder
/**
 * Node for the fraction with numerator/denominator
 * Allows for mixed representation (eg. 5 2/6) or improper (32/6)
 *
 * @author Michael Moorer (Berea College)
 * @author Vincent Davis (Berea College)
 */
define( function( require ) {

  'use strict';
  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var VALID_FRACTION_REPRESENTATIONS = [ 'improper', 'mixed' ];

  /**
   * @extends {Node}
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   * @constructor
   */
  function FractionNode( numeratorProperty, denominatorProperty, options ) {

    options = _.extend( {
      font: IntroConstants.TEXT_SIZE,
      wholeFont: IntroConstants.TEXT_SIZE,
      dividingLineLength: IntroConstants.DIVIDING_LINE_LENGTH,
      dividingLineWidth: IntroConstants.DIVIDING_LINE_WIDTH,
      color: 'black',
      fractionRepresentation: 'improper' // valid choices are 'improper' and 'mixed'
    }, options );

    assert && assert( _.includes( VALID_FRACTION_REPRESENTATIONS, options.fractionRepresentation ), 'invalid representation: ' + options.fractionRepresentation );

    Node.call( this );

    var remainderProperty = new DerivedProperty( [ numeratorProperty, denominatorProperty ],
      function( numerator, denominator ) {
        return numerator % denominator;
      } );

    var isRemainderNonZeroProperty = new DerivedProperty( [ remainderProperty ],
      function( remainder ) {
        return remainder !== 0;
      } );

    var wholeNumberProperty = new DerivedProperty( [ numeratorProperty, denominatorProperty ],
      function( numerator, denominator ) {
        return Math.floor( numerator / denominator );
      } );

    var isWholeNumberNonZeroProperty = new DerivedProperty( [ wholeNumberProperty ],
      function( wholeNumber ) {
        return wholeNumber !== 0;
      } );

    var fraction; // {VBox}

    if ( options.fractionRepresentation === 'improper' ) {
      fraction = createFraction( numeratorProperty, denominatorProperty );
      this.addChild( fraction );
    }
    else if ( options.fractionRepresentation === 'mixed' ) {
      var wholeNumberText = new Text( wholeNumberProperty.value, {
        font: options.wholeFont
      } );
      isWholeNumberNonZeroProperty.linkAttribute( wholeNumberText, 'visible' );
      wholeNumberProperty.linkAttribute( wholeNumberText, 'text' );

      fraction = createFraction( remainderProperty, denominatorProperty );
      isRemainderNonZeroProperty.linkAttribute( fraction, 'visible' );

      this.addChild( new HBox( { children: [ wholeNumberText, fraction ] } ) );
    }

    /**
     * create a fraction with a numerator and a denominator separated by a line
     * @param {Property.<number>} numeratorProperty
     * @param {Property.<number>} denominatorProperty
     * @returns {VBox}
     */
    function createFraction( numeratorProperty, denominatorProperty ) {

      var divisionLine = new Line( 0, 0, options.dividingLineLength, 0, {
        stroke: options.color,
        lineWidth: options.dividingLineWidth,
        lineCap: 'round'
      } );
      var numeratorText = new Text( numeratorProperty.value, { font: options.font } );
      var denominatorText = new Text( denominatorProperty.value, { font: options.font } );

      var fraction = new VBox( {
        children: [ numeratorText, divisionLine, denominatorText ]
      } );

      numeratorProperty.linkAttribute( numeratorText, 'text' );
      denominatorProperty.linkAttribute( denominatorText, 'text' );

      fraction.unlinkAttributes = function() {
        numeratorProperty.unlinkAttribute( numeratorText, 'text' );
        denominatorProperty.unlinkAttribute( denominatorText, 'text' );
      };

      return fraction;
    }

    this.fractionNodeDispose = function() {
      remainderProperty.dispose();
      isRemainderNonZeroProperty.dispose();
      wholeNumberProperty.dispose();
      isWholeNumberNonZeroProperty.dispose();
      fraction.unlinkAttributes();
    };
  }

  fractionsIntro.register( 'FractionNode', FractionNode );

  return inherit( Node, FractionNode, {
    /**
     * dispose of the links for garbage collection
     * @public
     */
    dispose: function() {
      this.fractionNodeDispose();
      Node.prototype.dispose.call( this );
    }
  } );
} );