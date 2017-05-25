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
    var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
    var FractionNode = require( 'FRACTIONS_INTRO/intro/view/FractionNode' );
    var inherit = require( 'PHET_CORE/inherit' );
    var MaxSpinner = require( 'FRACTIONS_INTRO/intro/view/MaxSpinner' );
    var Node = require( 'SCENERY/nodes/Node' );
    var NumberLineNode = require( 'FRACTIONS_INTRO/intro/view/NumberLineNode' );
    var NumberProperty = require( 'AXON/NumberProperty' );
    var RepresentationPanel = require( 'FRACTIONS_INTRO/intro/view/RepresentationPanel' );
    var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var ScreenView = require( 'JOIST/ScreenView' );

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Temporary images and modules used to find true position of elements based on original simulation
    var RangeWithValue = require( 'DOT/RangeWithValue' );
    var NumberSpinner = require( 'SUN/NumberSpinner' );
    var Image = require( 'SCENERY/nodes/Image' );
    var HSlider = require( 'SUN/HSlider' );

    // images
    var image0 = require( 'image!FRACTIONS_INTRO/0.PNG' );
    var image1 = require( 'image!FRACTIONS_INTRO/1.PNG' );
    var image2 = require( 'image!FRACTIONS_INTRO/2.PNG' );
    var image3 = require( 'image!FRACTIONS_INTRO/3.PNG' );
    var image4 = require( 'image!FRACTIONS_INTRO/4.PNG' );
    var image5 = require( 'image!FRACTIONS_INTRO/5.PNG' );
    var image6 = require( 'image!FRACTIONS_INTRO/6.PNG' );
    var image7 = require( 'image!FRACTIONS_INTRO/7.PNG' );
    var image8 = require( 'image!FRACTIONS_INTRO/8.PNG' );
    var image9 = require( 'image!FRACTIONS_INTRO/9.PNG' );
    var image10 = require( 'image!FRACTIONS_INTRO/10.PNG' );
    var image11 = require( 'image!FRACTIONS_INTRO/11.PNG' );
    var image12 = require( 'image!FRACTIONS_INTRO/12.PNG' );
    var image13 = require( 'image!FRACTIONS_INTRO/13.PNG' );
    var image14 = require( 'image!FRACTIONS_INTRO/14.PNG' );
    var image15 = require( 'image!FRACTIONS_INTRO/15.PNG' );
    var image16 = require( 'image!FRACTIONS_INTRO/16.PNG' );
    var image17 = require( 'image!FRACTIONS_INTRO/17.PNG' );
    var image18 = require( 'image!FRACTIONS_INTRO/18.PNG' );
    var image19 = require( 'image!FRACTIONS_INTRO/19.PNG' );
    var image20 = require( 'image!FRACTIONS_INTRO/20.PNG' );
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
          left: 10,
          top: representationPanel.bottom + 60
        } );

      // create beaker node
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
          case Representation.CIRCLE:
            // representationsNode.addChild( circleNode );
            break;
          case Representation.HORIZONTAL_BAR:
            // representationsNode.addChild( horizontalBarNode );
            break;
          case Representation.VERTICAL_BAR:
            // representationsNode.addChild( verticalBarNode );
            break;
          case Representation.BEAKER:
            representationsNode.addChild( beakerNode );
            break;
          case Representation.CAKE:
            // representationsNode.addChild( cakeNode );
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
        right: this.layoutBounds.maxX - 10,
        y: this.layoutBounds.minY + 80
      } );

      // fraction node with spinners on the denominator and numerator
      var fractionNode = new FractionNode( introModel.numeratorProperty,
        introModel.denominatorProperty, introModel.maxProperty, {
          x: 100,
          bottom: this.layoutBounds.maxY - 10
        } );

      // create bucket node
      var bucketNode = new BucketNode( introModel.representationProperty,
        introModel.denominatorProperty, introModel.segmentProperty );

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Temporary code used to find true of elements based on original simulation
      // image list
      var imageList = [];
      imageList.push( image0, image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
        image11, image12, image13, image14, image15, image16, image17, image18, image19, image20 );

      var transparencyProperty = new NumberProperty( 0.5 );
      var transparencySlider = new HSlider( transparencyProperty, {
        min: 0,
        max: 1
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