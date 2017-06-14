// Copyright 2017, University of Colorado Boulder
/**
 * Node for round spinner with fire on hold and callback options.
 *
 * @author Dusty Cole (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} upEnabledProperty
   * @param {Property.<boolean>} downEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function RoundSpinner( valueProperty, upEnabledProperty, downEnabledProperty, options ) {

    options = _.extend( {
      upButtonListener: function() {
        valueProperty.set( valueProperty.get() + 1 );
      },
      downButtonListener: function() {
        valueProperty.set( valueProperty.get() - 1 );
      },
      fireOnHold: true,
      orientation: 'vertical', // orientation of the spinner with respect to one another
      arrowOrientation: 'vertical', // direction of the arrow within a spinner
      iconScale: 1.3,
      radius: 20,
      spacing: 6
    }, options );

    var shapeWidth = options.radius * options.iconScale;

    // shape of the arrow
    var arrowShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, -shapeWidth / 3 ).lineTo( shapeWidth, 0 );

    // rotation of the arrow for the increment and decrement buttons
    var incrementIconRotation = ( options.arrowOrientation === 'horizontal' ) ? Math.PI / 2 : 0;
    var decrementIconRotation = ( options.arrowOrientation === 'horizontal' ) ? 3 * Math.PI / 2 : Math.PI;

    var incrementIcon = new Path( arrowShape, {
      lineWidth: options.radius / 4,
      stroke: 'black',
      lineCap: 'round',
      rotation: incrementIconRotation
    } );

    var decrementIcon = new Path( arrowShape, {
      lineWidth: options.radius / 4,
      stroke: 'black',
      lineCap: 'round',
      rotation: decrementIconRotation
    } );

    // offset of the arrow from center
    var offset = shapeWidth / 10;

    var incrementButton = new RoundPushButton( {
      content: incrementIcon,
      listener: options.upButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: '#fefd53',
      xContentOffset: (options.arrowOrientation === 'horizontal') ? offset : 0,
      yContentOffset: (options.arrowOrientation === 'horizontal') ? 0 : -offset,

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
      xContentOffset: (options.arrowOrientation === 'horizontal') ? -offset : 0,
      yContentOffset: (options.arrowOrientation === 'horizontal') ? 0 : offset,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );

    upEnabledProperty.linkAttribute( incrementButton, 'enabled' );

    downEnabledProperty.linkAttribute( decrementButton, 'enabled' );

    this.roundSpinnerDispose = function() {
      upEnabledProperty.unlinkAttribute( incrementButton );
      downEnabledProperty.unlinkAttribute( decrementButton );
    };

    // decrement button is on the left side in horizontal orientation but at the bottom when  oriented vertically
    var orderArray = (options.orientation === 'horizontal') ? [ decrementButton, incrementButton ] : [ incrementButton, decrementButton ];

    LayoutBox.call( this, { spacing: options.spacing, children: orderArray } );

    this.mutate( options );
  }

  fractionsIntro.register( 'RoundSpinner', RoundSpinner );

  return inherit( LayoutBox, RoundSpinner, {
    /**
     * dispose function
     * @public
     */
    dispose: function() {
      this.roundSpinnerDispose();
    }
  } );
} );
