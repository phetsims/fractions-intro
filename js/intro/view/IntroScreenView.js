// Copyright 2017, University of Colorado Boulder

/**
 * Main screen view of the Intro screen for Fractions Intro, which shows a radio button group of representations
 * at the top, a fraction in the bottom left and the selected representation in the middle of the screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
    'use strict';

    // modules
    var BeakerNode = require( 'FRACTIONS_INTRO/intro/view/BeakerNode' );
    var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
    var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
    var inherit = require( 'PHET_CORE/inherit' );
    var MaxSpinner = require( 'FRACTIONS_INTRO/intro/view/MaxSpinner' );
    var Node = require( 'SCENERY/nodes/Node' );
    var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
    var NumberProperty = require( 'AXON/NumberProperty' );
    var RepresentationPanel = require( 'FRACTIONS_INTRO/intro/view/RepresentationPanel' );
    var RepresentationState = require( 'FRACTIONS_INTRO/intro/model/RepresentationState' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var ScreenView = require( 'JOIST/ScreenView' );

    /**
     * @param {IntroModel} introModel
     * @constructor
     */
    function IntroScreenView( introModel ) {

      ScreenView.call( this );

      // Reset All button
      var resetAllButton = new ResetAllButton( {
        listener: function() {
          introModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );

      // representation panel at the top of the simulation
      var representationPanel = new RepresentationPanel( introModel.representationProperty, {
        centerX: this.layoutBounds.centerX,
        y: 10
      } );

      // create number line Node
      var numberLineNode = new NumberLineNode( introModel.numeratorProperty,
        introModel.denominatorProperty,
        introModel.maxProperty,
        new NumberProperty( 1 ), {
          left: 10,
          top: representationPanel.bottom + 60
        } );

      var beakerNode = new BeakerNode( introModel.denominatorProperty, introModel.fractionProperty, {
        beakerWidth: 80,
        beakerHeight: 200,
        centerX: this.layoutBounds.centerX,
        top: representationPanel.bottom + 60
      } );

      // generic node storing the various representation
      var representationsNode = new Node();

      // present of the lifetime of the simulation
      introModel.representationProperty.link( function( representation ) {
        if ( representationsNode.hasChildren() ) {
          representationsNode.removeAllChildren();
        }
        switch( representation ) {
          case RepresentationState.CIRCLE:
            // representationsNode.addChild( circleNode );
            break;
          case RepresentationState.HORIZONTAL_BAR:
            // representationsNode.addChild( horizontalBarNode );
            break;
          case RepresentationState.VERTICAL_BAR:
            // representationsNode.addChild( verticalBarNode );
            break;
          case RepresentationState.BEAKER:
            representationsNode.addChild( beakerNode );
            break;
          case RepresentationState.CAKE:
            // representationsNode.addChild( cakeNode );
            break;
          case RepresentationState.NUMBER_LINE:
            representationsNode.addChild( numberLineNode );
            break;
          default:
            throw new Error( 'invalid representation: ' + representation );
        }
      } );

      // create spinner controlling the maximum
      var maxSpinner = new MaxSpinner( introModel.maxProperty, {
        right: this.layoutBounds.maxX - 10,
        y: this.layoutBounds.minY + 80
      } );

      // fraction node with spinners on the denominator and numerator
      var fractionNode = new FractionNode( introModel.numeratorProperty, introModel.denominatorProperty, introModel.maxProperty, {
        x: 100,
        bottom: this.layoutBounds.maxY - 10
      } );

      var options = {
        children: [ resetAllButton, representationsNode, fractionNode, maxSpinner, representationPanel ]
      };
      this.mutate( options );
    }

    fractionsIntro.register( 'IntroScreenView', IntroScreenView );

    return inherit( ScreenView, IntroScreenView );
  }
);