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
      orientation: 'horizontal',
      buttonOrientation: 'vertical',
      iconScale: 1.3,
      radius: 20,
      spacing: 6
    }, options );

    var shapeWidth = options.radius * options.iconScale;

    var arrowShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, -10 * options.radius / 20 ).lineTo( shapeWidth, 0 );

    var incrementIcon = new Path( arrowShape, {
      lineWidth: 5 * options.radius / 20,
      stroke: 'black',
      lineCap: 'round'
    } );

    var decrementIcon = new Path( arrowShape, {
      lineWidth: 5 * options.radius / 20,
      stroke: 'black',
      lineCap: 'round'
    } );
    decrementIcon.rotateAround( decrementIcon.center, Math.PI );

    // Adjust the the arrow on the button for the correct orientation
    if ( options.orientation === 'horizontal' ) {
      incrementIcon.rotateAround( incrementIcon.center, Math.PI / 2 );
      decrementIcon.rotateAround( decrementIcon.center, Math.PI / 2 );
      var xContentOffset = -3;
      var yContentOffset = 0;
    }
    else {
      yContentOffset = -3;
      xContentOffset = 0;

    }

    var incrementButton = new RoundPushButton( {
      content: incrementIcon,
      listener: options.upButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: (options.orientation === 'horizontal') ? -yContentOffset : yContentOffset,
      xContentOffset: -xContentOffset,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );

    var decrementButton = new RoundPushButton( {
      content: decrementIcon,
      listener: options.downButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      yContentOffset: (options.orientation === 'horizontal') ? yContentOffset : -yContentOffset,
      xContentOffset: xContentOffset,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );

    upEnabledProperty.linkAttribute( incrementButton, 'enabled' );

    downEnabledProperty.linkAttribute( decrementButton, 'enabled' );

    var orderArray = (options.orientation === 'horizontal') ? [ decrementButton, incrementButton ] : [ incrementButton, decrementButton ];

    LayoutBox.call( this, { spacing: options.spacing, children: orderArray } );

    this.mutate( options );
  }

  fractionsIntro.register( 'RoundSpinner', RoundSpinner );

  return inherit( LayoutBox, RoundSpinner );
} );
