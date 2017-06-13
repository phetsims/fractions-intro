// Copyright 2017, University of Colorado Boulder
/**
 * Node for spinner with fire on hold and callback options.  Used in the Fractions sims to increase/decrease numerator/denominator.
 *
 * @author Dusty Cole (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   *
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} upEnabledProperty
   * @param {Property.<boolean>} downEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function RoundSpinner( valueProperty, upEnabledProperty, downEnabledProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      upButtonListener: function() {
        valueProperty.set( valueProperty.get() + 1 );
      },
      downButtonListener: function() {
        valueProperty.set( valueProperty.get() - 1 );
      },
      fireOnHold: false,
      orientation: 'vertical',
      buttonOrientation: 'vertical',
      iconScale: 1.3,
      radius: 20
    }, options );

    var shapeWidth = options.radius * options.iconScale;
    var upShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, -10 * options.radius / 20 ).lineTo( shapeWidth, 0 );
    var downShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, 10 * options.radius / 20 ).lineTo( shapeWidth, 0 );

    var upIcon = new Path( upShape, { lineWidth: 5 * options.radius / 20, stroke: 'black', lineCap: 'round' } );
    var downIcon = new Path( downShape, { lineWidth: 5 * options.radius / 20, stroke: 'black', lineCap: 'round' } );

    var upButton = new RoundPushButton( {
      content: upIcon,
      listener: options.upButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: -3,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );
    upEnabledProperty.linkAttribute( upButton, 'enabled' );

    var downButton = new RoundPushButton( {
      content: downIcon,
      listener: options.downButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: +3,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );
    downEnabledProperty.linkAttribute( downButton, 'enabled' );

    LayoutBox.call( this, { spacing: 6, children: [ upButton, downButton ] } );

    this.mutate( options );
  }

  fractionsIntro.register( 'RoundSpinner', RoundSpinner );

  return inherit( LayoutBox, RoundSpinner );
} );
