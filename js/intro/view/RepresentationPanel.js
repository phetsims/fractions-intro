// Copyright 2017, University of Colorado Boulder
/**
 * The large horizontal panel at the top of the screen for selecting different representations.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberLineIcon = require( 'FRACTIONS_INTRO/intro/view/NumberLineIcon' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );

  // constants
  var ICON_SCALE = 1.00;

  /**
   *
   * @param {Property.<string>} representationProperty
   * @param {Object} [options]
   * @constructor
   */
  function RepresentationPanel( representationProperty, options ) {

    options = _.extend( {
      fill: '#efe8e1',
      xMargin: 10,
      yMargin: 7
    }, options );

    // TODO get the size and color from the java simulation
    var content = new RadioButtonGroup( representationProperty, [
      {
        value: Representation.CIRCLE,
        node: new Circle( 15 * ICON_SCALE, {
          fill: '#8EC53F',
          lineWidth: 2,
          stroke: 'black'
        } )
      },
      {
        value: Representation.HORIZONTAL_BAR,
        node: new Rectangle( 0, 0, 80 * ICON_SCALE, 20 * ICON_SCALE, {
          fill: '#ED4344',
          lineWidth: 2,
          stroke: 'black'
        } )
      },
      {
        value: Representation.VERTICAL_BAR,
        node: new Rectangle( 0, 0, 35 * ICON_SCALE, 60 * ICON_SCALE, {
          fill: '#56B6DE',
          lineWidth: 2,
          stroke: 'black'
        } )
      },

      {
        value: Representation.BEAKER,
        node: new Rectangle( 0, 0, 35 * ICON_SCALE, 60 * ICON_SCALE, {
          fill: '#563329',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: Representation.CAKE,
        node: new Circle( 15 * ICON_SCALE, {
          fill: 'brown',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: Representation.NUMBER_LINE,
        node: new NumberLineIcon()
      }
    ], {
      // RadioButtonGroup options
      orientation: 'horizontal',
      baseColor: 'white',
      cornerRadius: 10,
      spacing: 12
    } );

    Panel.call( this, content, options );
  }

  fractionsIntro.register( 'RepresentationPanel', RepresentationPanel );

  return inherit( Panel, RepresentationPanel );
} );