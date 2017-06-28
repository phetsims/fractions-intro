// Copyright 2017, University of Colorado Boulder

/**
 * The large horizontal panel at the top of the screen for selecting different representations.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberLineIcon = require( 'FRACTIONS_INTRO/intro/view/NumberLineIcon' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );

  // images
  var cakeImage = require( 'image!FRACTIONS_INTRO/cake_1_1.png' );

  /**
   *
   * @param {Property.<Representation>} representationProperty
   * @param {Object} [options]
   * @constructor
   */
  function RepresentationPanel( representationProperty, options ) {

    options = _.extend( {
      fill: '#efe8e1',
      xMargin: 10,
      yMargin: 10
    }, options );

    var content = new RadioButtonGroup( representationProperty, [
      {
        value: Representation.CIRCLE,
        node: new Circle( 20, {
          fill: '#8EC53F',
          lineWidth: 2,
          stroke: 'black'
        } )
      },
      {
        value: Representation.HORIZONTAL_BAR,
        node: new Rectangle( {
          rectWidth: 80,
          rectHeight: 20,
          fill: '#ED4344',
          lineWidth: 2,
          stroke: 'black'
        } )
      },
      {
        value: Representation.VERTICAL_BAR,
        node: new Rectangle( {
          rectWidth: 40,
          rectHeight: 60,
          fill: '#FFE600',
          lineWidth: 2,
          stroke: 'black'
        } )
      },
      {
        value: Representation.BEAKER,
        node: new BeakerNode( 1, 1, {
          yRadius: 4.5,
          xRadius: 15,
          fullHeight: 55
        } )
      },
      {
        value: Representation.CAKE,
        node: new Image( cakeImage, {
          maxHeight: 75
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
      spacing: 12,
      buttonContentXMargin: 10,
      buttonContentYMargin: 20
    } );

    Panel.call( this, content, options );
  }

  fractionsIntro.register( 'RepresentationPanel', RepresentationPanel );

  return inherit( Panel, RepresentationPanel );
} );