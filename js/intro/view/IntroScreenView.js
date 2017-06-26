// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularView = require( 'FRACTIONS_INTRO/intro/view/RectangularView' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
  var RepresentationPanel = require( 'FRACTIONS_INTRO/intro/view/RepresentationPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Temporary images and modules used to find true position of elements based on original simulation
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Property = require( 'AXON/Property' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HSlider = require( 'SUN/HSlider' );

  // images
  var image0 = require( 'image!FRACTIONS_INTRO/0.png' );
  var image1 = require( 'image!FRACTIONS_INTRO/1.png' );
  var image2 = require( 'image!FRACTIONS_INTRO/2.png' );
  var image3 = require( 'image!FRACTIONS_INTRO/3.png' );
  var image4 = require( 'image!FRACTIONS_INTRO/4.png' );
  var image5 = require( 'image!FRACTIONS_INTRO/5.png' );
  var image6 = require( 'image!FRACTIONS_INTRO/6.png' );
  var image7 = require( 'image!FRACTIONS_INTRO/7.png' );
  var image8 = require( 'image!FRACTIONS_INTRO/8.png' );
  var image9 = require( 'image!FRACTIONS_INTRO/9.png' );
  var image10 = require( 'image!FRACTIONS_INTRO/10.png' );
  var image11 = require( 'image!FRACTIONS_INTRO/11.png' );
  var image12 = require( 'image!FRACTIONS_INTRO/12.png' );
  var image13 = require( 'image!FRACTIONS_INTRO/13.png' );
  var image14 = require( 'image!FRACTIONS_INTRO/14.png' );
  var image15 = require( 'image!FRACTIONS_INTRO/15.png' );
  var image16 = require( 'image!FRACTIONS_INTRO/16.png' );
  var image17 = require( 'image!FRACTIONS_INTRO/17.png' );
  var image18 = require( 'image!FRACTIONS_INTRO/18.png' );
  var image19 = require( 'image!FRACTIONS_INTRO/19.png' );
  var image20 = require( 'image!FRACTIONS_INTRO/20.png' );
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * @constructor
   * @extends {ScreenView}
   *
   * @param {IntroModel} model
   */
  function IntroScreenView( model ) {

    var self = this;

    ScreenView.call( this );

    // fix bugs of some kind. Talk to Jonathon
    this.preventFit = true;

    // create and add maxSpinner at the right top of the screen
    this.addChild( new MaxSpinner(
      model.maxProperty, {
        right: this.layoutBounds.right - 20,
        top: this.layoutBounds.top + 25
      } ) );

    // create and add fraction N/D with spinners on the bottom left side
    this.addChild( new HBox( {
      spacing: 2,
      children: [
        new FractionWithSpinners(
          model.numeratorProperty,
          model.denominatorProperty,
          model.maxProperty ),
          new Text( '=', {
          font: new PhetFont( 110)
        } ),
        new FractionNode( model.numeratorProperty, model.denominatorProperty, {
          expression: 'mixed'
        } ) ],
      bottom: this.layoutBounds.bottom - 10,
        left: this.layoutBounds.left + 30
    } ) );

    // Reset all button
    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } ) );

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
        self.currentView = new RectangularView( model );
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Temporary code used to find true of elements based on original simulation
    // image list
    var imageList = [];
    imageList.push( image0, image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
      image11, image12, image13, image14, image15, image16, image17, image18, image19, image20 );

    var transparencyProperty = new NumberProperty( 0 );
    this.addChild( new HSlider( transparencyProperty, {
      min: 0,
      max: 0.8
    }, { right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 70 } ) );

    var pictureIndex = new NumberProperty( 0 );
    var rangeProperty = new Property( new RangeWithValue( 0, 20, 0 ) );
    this.addChild( new NumberSpinner( pictureIndex, rangeProperty, {
      right: this.layoutBounds.right - 20,
      bottom: this.layoutBounds.bottom - 120
    } ) );

    var pictureNode = new Node();
    transparencyProperty.link( function( transparency ) {
      pictureNode.opacity = transparency;
    } );
    this.addChild( pictureNode );
    pictureIndex.link( function( number ) {
      pictureNode.removeAllChildren();
      var img = new Image( imageList[ number ] );
      pictureNode.addChild( img );
      var width = pictureNode.width;
      var height = pictureNode.height;
      pictureNode.scale( self.layoutBounds.width / width, self.layoutBounds.height / height );
    } );
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  fractionsIntro.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView, {
    /**
     *
     * @param {number} dt - time step
     * @public
     */
    step: function( dt ) {
      this.currentView.step( dt );
    }
  } );
} );
