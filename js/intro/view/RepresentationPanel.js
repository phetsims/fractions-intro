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
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberLineIcon = require( 'FRACTIONS_INTRO/intro/view/NumberLineIcon' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

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
        value: 'circle',
        node: new Circle( 15 * ICON_SCALE, {
          fill: 'green',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: 'horizontal-bar',
        node: new Rectangle( 0, 0, 80 * ICON_SCALE, 10 * ICON_SCALE, {
          fill: '#208644',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: 'vertical-bar',
        node: new Rectangle( 0, 0, 20 * ICON_SCALE, 60 * ICON_SCALE, {
          fill: 'red',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: 'beaker',
        node: new Rectangle( 0, 0, 100 * ICON_SCALE, 80 * ICON_SCALE, {
          fill: '#563329',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: 'cake',
        node: new Circle( 15 * ICON_SCALE, {
          fill: 'brown',
          lineWidth: 1,
          stroke: 'black'
        } )
      },
      {
        value: 'number-line',
        node: new NumberLineIcon( {
          fill: '#563329',
          lineWidth: 1,
          stroke: 'black'
        } )
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

