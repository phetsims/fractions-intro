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

  // constants
  var ORIENTATION_VALUES = [ 'horizontal', 'vertical' ];   // possible values for options.orientation
  var ARROW_ORIENTATION_VALUES = [ 'horizontal', 'vertical' ];   // possible values for options.arrowOrientation

  /**
   * @extends {LayoutBox}
   *
   * @param {function} upButtonListener
   * @param {function} downButtonListener
   * @param {Property.<boolean>} upEnabledProperty
   * @param {Property.<boolean>} downEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function RoundSpinner( upButtonListener, downButtonListener, upEnabledProperty, downEnabledProperty, options ) {

    options = _.extend( {
      baseColor: '#fefd53',  // color of the button
      radius: 20, // radius of the push button
      iconScale: 0.65, // ratio of the width of the arrow over the diameter of the button
      spacing: 6, // separation of the two buttons
      orientation: 'vertical', // orientation of the spinner with respect to one another
      arrowOrientation: 'vertical', // direction of the arrow within a spinner
      fireOnHold: true
    }, options );

    // validate options
    assert && assert( _.includes( ORIENTATION_VALUES, options.orientation ), 'invalid orientation: ' + options.orientation );
    assert && assert( _.includes( ARROW_ORIENTATION_VALUES, options.arrowOrientation ), 'invalid arrowOrientation: ' + options.arrowOrientation );

    // width of the arrow
    var shapeWidth = options.radius * options.iconScale * 2;

    // shape of the arrow, pointing up
    var arrowShape = new Shape().moveTo( 0, 0 ).lineTo( shapeWidth / 2, -shapeWidth / 3 ).lineTo( shapeWidth, 0 );

    // rotation of the arrow for the increment and decrement buttons depending upon orientation
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
      listener: upButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: options.baseColor,

      // depend upon arrow orientation
      xContentOffset: (options.arrowOrientation === 'horizontal') ? offset : 0,
      yContentOffset: (options.arrowOrientation === 'horizontal') ? 0 : -offset,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );

    var decrementButton = new RoundPushButton( {
      content: decrementIcon,
      listener: downButtonListener,
      radius: options.radius,
      touchAreaDilation: 5,
      baseColor: options.baseColor,

      // depend upon arrow orientation
      xContentOffset: (options.arrowOrientation === 'horizontal') ? -offset : 0,
      yContentOffset: (options.arrowOrientation === 'horizontal') ? 0 : offset,

      // options related to fire-on-hold feature
      fireOnHold: options.fireOnHold,
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 200 // fire continuously at this interval (milliseconds)
    } );

    upEnabledProperty.linkAttribute( incrementButton, 'enabled' );
    downEnabledProperty.linkAttribute( decrementButton, 'enabled' );

    this.disposeRoundSpinner = function() {
      upEnabledProperty.unlinkAttribute( incrementButton );
      downEnabledProperty.unlinkAttribute( decrementButton );
    };

    // decrement button is on the left side in horizontal orientation but at the bottom when oriented vertically
    var orderArray = (options.orientation === 'horizontal') ?
      [ decrementButton, incrementButton ] :
      [ incrementButton, decrementButton ];

    options = _.extend( { spacing: options.spacing, children: orderArray },
      options );

    LayoutBox.call( this, options );
  }

  fractionsIntro.register( 'RoundSpinner', RoundSpinner );

  return inherit( LayoutBox, RoundSpinner, {
    /**
     * dispose function
     * @public
     */
    dispose: function() {
      this.disposeRoundSpinner();
    }
  } );
} );
