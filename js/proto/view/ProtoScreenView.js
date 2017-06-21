// Copyright 2017, University of Colorado Boulder

/**
 * TODO: doc
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerView = require( 'FRACTIONS_INTRO/proto/view/BeakerView' );
  var CircularView = require( 'FRACTIONS_INTRO/proto/view/CircularView' );
  var NumberLineView = require( 'FRACTIONS_INTRO/proto/view/NumberLineView' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RectangularView = require( 'FRACTIONS_INTRO/proto/view/RectangularView' );
  var Representation = require( 'FRACTIONS_INTRO/proto/model/Representation' );
  var RepresentationPanel = require( 'FRACTIONS_INTRO/proto/view/RepresentationPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RoundSpinner = require( 'FRACTIONS_INTRO/intro/view/RoundSpinner' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Temporary images and modules used to find true position of elements based on original simulation
  var RangeWithValue = require( 'DOT/RangeWithValue' );
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
   * @extend {ScreenView}
   *
   * @param {ProtoModel} model
   */
  function ProtoScreenView( model ) {

    var self = this;

    ScreenView.call( this );

    // fix bugs of some kind. Talk to Jonathon
    this.preventFit = true;

    // @private {ProtoModel}
    this.model = model;

    var textOptions = {
      font: new PhetFont( 80 )
    };

    var maxTextOptions = {
      font: new PhetFont( 30 )
    };

    var numeratorText = new Text( '', textOptions );
    model.numeratorProperty.linkAttribute( numeratorText, 'text' );

    var denominatorText = new Text( '', textOptions );
    model.denominatorProperty.linkAttribute( denominatorText, 'text' );

    var maxText = new Text( '', maxTextOptions );
    model.maxProperty.linkAttribute( maxText, 'text' );

    var modelProperties = [ model.numeratorProperty, model.denominatorProperty, model.maxProperty ];
    var canIncreaseNumeratorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( numerator + 1 ) / denominator <= max;
    } );
    var canDecreaseNumeratorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( numerator - 1 ) >= 0;
    } );
    var canIncreaseDenominatorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( denominator + 1 ) <= ProtoConstants.DENOMINATOR_RANGE.max;
    } );
    var canDecreaseDenominatorProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( denominator - 1 ) >= ProtoConstants.DENOMINATOR_RANGE.min && numerator / ( denominator - 1 ) <= max;
    } );
    var canIncreaseMaxProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return ( max + 1 ) <= ProtoConstants.MAX_RANGE.max;
    } );
    var canDecreaseMaxProperty = new DerivedProperty( modelProperties, function( numerator, denominator, max ) {
      return max > ProtoConstants.MAX_RANGE.min;
    } );

    var numeratorSpinner = new RoundSpinner( function() {model.numeratorProperty.value++},
      function() {model.numeratorProperty.value--}, canIncreaseNumeratorProperty, canDecreaseNumeratorProperty );
    var denominatorSpinner = new RoundSpinner( function() {model.denominatorProperty.value++},
      function() {model.denominatorProperty.value--}, canIncreaseDenominatorProperty, canDecreaseDenominatorProperty );
    var maxSpinner = new RoundSpinner( function() { model.maxProperty.value++},
      function() { model.maxProperty.value--}, canIncreaseMaxProperty, canDecreaseMaxProperty, {radius:15, spacing:3} );

    // TODO: Rearrange this on the screen
    this.addChild( new VBox( {
      children: [
        new Text( 'Max', { font: new PhetFont( 30 ) } ),
        new HBox( {
            children: [
              maxText,
              maxSpinner
            ],
          spacing:7
          }
        )
      ],
      spacing: 10,
      right: this.layoutBounds.right - 10
    } ) );
    this.addChild( new HBox( {
      children: [
        new VBox( {
          children: [
            numeratorSpinner,
            denominatorSpinner
          ],
          spacing: 30
        } ),
        new VBox( {
          children: [
            numeratorText,
            new Line( 0, 0, 80, 0, { stroke: 'black', lineWidth: 8, lineCap: 'round' } ),
            denominatorText
          ],
          spacing: 10
        } )
      ],
      spacing: 30,
      left: this.layoutBounds.left + 10,
      bottom: this.layoutBounds.bottom - 10
    } ) );

    // Reset all button
    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } ) );

    var viewContainer = new Node( {
      translation: this.layoutBounds.center.plusXY( 0, 100 )
    } );

    this.addChild( viewContainer );

    // @private TODO doc
    this.currentView = null;

    // representation panel at the top of the simulation
    this.addChild( new RepresentationPanel( model.representationProperty, {
      centerX: this.layoutBounds.centerX,
      y: 10
    } ) );

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
      else if ( representation === Representation.NUMBER_LINE ) {

        // TODO: find a more general way to lay out the numberLine than reversing the action of viewContainer
        self.currentView = new NumberLineView(
          self.model.numeratorProperty,
          self.model.denominatorProperty,
          self.model.maxProperty,
          new NumberProperty( 1 ), { x: 50 - self.layoutBounds.centerX, y: -100 }
        );
      }
      if ( self.currentView ) {
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

  fractionsIntro.register( 'ProtoScreenView', ProtoScreenView );

  return inherit( ScreenView, ProtoScreenView, {
    step: function( dt ) {
      this.currentView.step( dt );
    }
  } );
} );
