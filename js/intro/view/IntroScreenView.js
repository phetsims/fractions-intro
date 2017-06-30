// Copyright 2017, University of Colorado Boulder

/**
 * layout everything that appear on the screen
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerView = require( 'FRACTIONS_INTRO/intro/view/BeakerView' );
  var CakeView = require( 'FRACTIONS_INTRO/intro/view/CakeView' );
  var CircularView = require( 'FRACTIONS_INTRO/intro/view/CircularView' );
  var NumberLineView = require( 'FRACTIONS_INTRO/intro/view/NumberLineView' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
  var FractionWithSpinners = require( 'FRACTIONS_INTRO/intro/view/FractionWithSpinners' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MaxSpinner = require( 'FRACTIONS_INTRO/intro/view/MaxSpinner' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OnOffSwitch = require( 'SUN/OnOffSwitch' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularView = require( 'FRACTIONS_INTRO/intro/view/RectangularView' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
  var RepresentationPanel = require( 'FRACTIONS_INTRO/intro/view/RepresentationPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * @extends {ScreenView}
   *
   * @param {IntroModel} model
   */
  function IntroScreenView( model ) {

    var self = this;

    ScreenView.call( this );

    // fix bugs of some kind. Talk to Jonathon. I think their is an issue somewhere else TODO: fix this once the other bug is fix
    this.preventFit = true;

    // representation panel at the top of the simulation
    this.addChild( new RepresentationPanel( model.representationProperty, {
      centerX: this.layoutBounds.centerX,
      y: 10
    } ) );

    var viewContainer = new Node( {
      translation: this.layoutBounds.center.plusXY( 0, 100 )
    } );

    this.addChild( viewContainer );

    // @private {Node} the visual representation of the container set
    this.currentView = null;

    // present for the lifetime of the simulation
    model.representationProperty.link( function( representation ) {
      // Finish all animations
      model.completeAllPieces();

      if ( self.currentView ) {
        viewContainer.removeChild( self.currentView );
        self.currentView.dispose();
      }

      // Should this be a switch statement?
      self.currentView = null;
      if ( representation === Representation.CIRCLE ) {
        self.currentView = new CircularView( model );
      }
      else if ( representation === Representation.VERTICAL_BAR ) {
        self.currentView = new RectangularView( model, {
          rectangle_orientation: 'vertical'
        } );
      }
      else if ( representation === Representation.HORIZONTAL_BAR ) {
        self.currentView = new RectangularView( model, {
          rectangle_orientation: 'horizontal',
          maxHorizontalContainers: 3
        } );
      }
      else if ( representation === Representation.BEAKER ) {
        self.currentView = new BeakerView( model );
      }
      else if ( representation === Representation.CAKE ) {
        self.currentView = new CakeView( model );
      }
      else if ( representation === Representation.NUMBER_LINE ) {

        // TODO: find a more general way to lay out the numberLine than reversing the action of viewContainer
        self.currentView = new NumberLineView(
          model.numeratorProperty,
          model.denominatorProperty,
          model.maxProperty,
          new NumberProperty( 1 ), { x: 25 - self.layoutBounds.centerX, y: -160 }
        );
      }
      if ( self.currentView ) {

        // add the chosen visual representation to the scene graph
        viewContainer.addChild( self.currentView );
      }
    } );

    var mixedFractionToggle = new Property( false );

    this.addChild( new OnOffSwitch( mixedFractionToggle, {
      right: this.layoutBounds.right - 20,
      bottom: this.layoutBounds.bottom - 120
    } ) );

    // create and add fraction N/D with spinners on the bottom left side
    var fractionBox = new HBox( {
      spacing: 2,
      children: [
        new FractionWithSpinners(
          model.numeratorProperty,
          model.denominatorProperty,
          model.maxProperty )
      ],
      bottom: self.layoutBounds.bottom - 10,
      left: self.layoutBounds.left + 30
    } );
    self.addChild( fractionBox );

    var mixedNodeBox = new HBox();

    // update fraction box depending upon mixed fraction toggle
    mixedFractionToggle.link( function( value ) {

      // create and add fraction N/D with spinners on the bottom left side and mixed fraction beside it
      if ( value ) {
        mixedNodeBox.removeAllChildren();
        mixedNodeBox.addChild( new Text( '=', {
          font: new PhetFont( 110 )
        } ) );
        mixedNodeBox.addChild( new FractionNode( model.numeratorProperty, model.denominatorProperty, {
          expression: 'mixed',
          font: new PhetFont( 110 ),
          dividingLineLength: (50),
          dividingLineWidth: (10)
        } ) );
        fractionBox.addChild( mixedNodeBox );
      }
      else {
        if ( fractionBox.hasChild( mixedNodeBox ) ) {
          fractionBox.removeChild( mixedNodeBox );
        }
      }

    } );

    // create and add maxSpinner at the right top of the screen
    this.addChild( new MaxSpinner(
      model.maxProperty, {
        right: this.layoutBounds.right - 20,
        top: this.layoutBounds.top + 25
      } ) );

    // Reset all button
    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } ) );
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView, {

    /**
     * Steps forward in time.
     *
     * @param {object} [options]
     * @param {number} dt - time step
     * @public
     */
    step: function( dt ) {
      this.currentView.step( dt );
    }
  } );
} );
