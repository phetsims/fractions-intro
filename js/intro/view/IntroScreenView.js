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
    var BucketNode = require( 'FRACTIONS_INTRO/intro/view/BucketNode' );
    var CakeNode = require( 'FRACTIONS_INTRO/intro/view/CakeNode' );
    var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
    var FractionWithSpinners = require( 'FRACTIONS_INTRO/intro/view/FractionWithSpinners' );
    var inherit = require( 'PHET_CORE/inherit' );
    var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
    var MaxSpinner = require( 'FRACTIONS_INTRO/intro/view/MaxSpinner' );
    var Node = require( 'SCENERY/nodes/Node' );
    var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
    var NumberProperty = require( 'AXON/NumberProperty' );
    var RepresentationPanel = require( 'FRACTIONS_INTRO/intro/view/RepresentationPanel' );
    var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var ScreenView = require( 'JOIST/ScreenView' );
    var Vector2 = require( 'DOT/Vector2' );
    var VerticalBarNode = require( 'FRACTIONS_INTRO/intro/view/VerticalBarNode' );

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
     * @param {IntroModel} introModel
     * @constructor
     */
    function IntroScreenView( introModel ) {

      ScreenView.call( this );
      var self = this;

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
          left: 5,
          top: representationPanel.bottom + 70
        } );

      // create beaker node
      var beakerNode = new BeakerNode( introModel.denominatorProperty, introModel.fractionProperty, {
        beakerWidth: IntroConstants.BEAKER_WIDTH,
        beakerHeight: IntroConstants.BEAKER_LENGTH,
        centerX: this.layoutBounds.centerX,
        top: representationPanel.bottom + 60
      } );

      var cakeNode = new CakeNode( introModel.numeratorProperty, introModel.denominatorProperty, {
        centerX: this.layoutBounds.centerX,
        top: representationPanel.bottom + 60
      } );

      var verticalBarNode = new VerticalBarNode( introModel.containerSet, {
        center: self.layoutBounds.center.plus( new Vector2( 0, -50 ) )
      } );

      // generic node storing the various representation
      var representationsNode = new Node();

      // present of the lifetime of the simulation
      introModel.representationProperty.link( function( representation ) {
        if ( representationsNode.hasChildren() ) {
          representationsNode.removeAllChildren();
        }
        switch( representation ) {
          case Representation.CIRCLE:
            // representationsNode.addChild( circleNode );
            break;
          case Representation.HORIZONTAL_BAR:
            // representationsNode.addChild( horizontalBarNode );
            break;
          case Representation.VERTICAL_BAR:
            representationsNode.addChild( verticalBarNode );
            break;
          case Representation.BEAKER:
            representationsNode.addChild( beakerNode );
            break;
          case Representation.CAKE:
            representationsNode.addChild( cakeNode );
            break;
          case Representation.NUMBER_LINE:
            representationsNode.addChild( numberLineNode );
            break;
          default:
            throw new Error( 'invalid representation: ' + representation );
        }
      } );

      // create spinner controlling the maximum
      var maxSpinner = new MaxSpinner( introModel.maxProperty, {
        right: this.layoutBounds.maxX - 15,
        y: this.layoutBounds.minY + 50
      } );

      // fraction node with spinners on the denominator and numerator
      var fractionNode = new FractionWithSpinners( introModel.numeratorProperty,
        introModel.denominatorProperty, introModel.maxProperty, {
          x: 120,
          bottom: this.layoutBounds.maxY - 5
        } );

      // create bucket node
      var bucketNode = new BucketNode( introModel, introModel.pieces, introModel.representationProperty,
        introModel.denominatorProperty, introModel.segmentProperty );

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Temporary code used to find true of elements based on original simulation
      // image list
      var imageList = [];
      imageList.push( image0, image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
        image11, image12, image13, image14, image15, image16, image17, image18, image19, image20 );

      var transparencyProperty = new NumberProperty( 0 );
      var transparencySlider = new HSlider( transparencyProperty, {
        min: 0,
        max: .8
      }, { right: this.layoutBounds.maxX - 10, bottom: resetAllButton.top - 10 } );

      var pictureIndex = new NumberProperty( 0 );
      var range = new RangeWithValue( 0, 20, 0 );
      var pictureSpinner = new NumberSpinner( pictureIndex, range, {
        right: this.layoutBounds.maxX - 20,
        bottom: resetAllButton.top - 80
      } );

      var pictureNode = new Node();
      transparencyProperty.link( function( transparency ) {
        pictureNode.opacity = transparency;
      } );
      pictureIndex.link( function( number ) {
        pictureNode.removeAllChildren();
        var img = new Image( imageList[ number ] );
        pictureNode.addChild( img );
        var width = pictureNode.width;
        var height = pictureNode.height;
        pictureNode.scale( self.layoutBounds.width / width, self.layoutBounds.height / height );
      } );
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      var options = {
        children: [ resetAllButton, representationsNode, fractionNode, maxSpinner, representationPanel, bucketNode,
          transparencySlider, pictureSpinner, pictureNode ]
      };
      this.mutate( options );
    }

    fractionsIntro.register( 'IntroScreenView', IntroScreenView );

    return inherit( ScreenView, IntroScreenView );
  }
);