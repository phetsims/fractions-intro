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
  var ProtoConstants = require( 'FRACTIONS_INTRO/proto/ProtoConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RectangularView = require( 'FRACTIONS_INTRO/proto/view/RectangularView' );
  var Representation = require( 'FRACTIONS_INTRO/proto/model/Representation' );
  var RepresentationPanel = require( 'FRACTIONS_INTRO/proto/view/RepresentationPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

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
    var numeratorText = new Text( '', textOptions );
    model.numeratorProperty.linkAttribute( numeratorText, 'text' );

    var denominatorText = new Text( '', textOptions );
    model.denominatorProperty.linkAttribute( denominatorText, 'text' );

    var maxText = new Text( '', textOptions );
    model.maxProperty.linkAttribute( maxText, 'text' );

    // TODO: Change these spinner to a more apporiate type such as number spinner.
    function createTempSpinner( property, upEnabledProperty, downEnabledProperty ) {
      var buttonOptions = {
        fireOnHold: true,
        fireOnHoldDelay: 400,
        fireOnHoldInterval: 100
      };

      var upButton = new RectangularPushButton( _.extend( {
        content: new Text( 'up', { font: new PhetFont( 15 ) } ),
        listener: function() {
          property.value += 1;
        }
      }, buttonOptions ) );
      upEnabledProperty.linkAttribute( upButton, 'enabled' );

      var downButton = new RectangularPushButton( _.extend( {
        content: new Text( 'down', { font: new PhetFont( 15 ) } ),
        listener: function() {
          property.value -= 1;
        }
      }, buttonOptions ) );
      downEnabledProperty.linkAttribute( downButton, 'enabled' );

      return new VBox( {
        children: [
          upButton,
          downButton
        ],
        spacing: 5
      } );
    }

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

    var numeratorSpinner = createTempSpinner( model.numeratorProperty, canIncreaseNumeratorProperty, canDecreaseNumeratorProperty );
    var denominatorSpinner = createTempSpinner( model.denominatorProperty, canIncreaseDenominatorProperty, canDecreaseDenominatorProperty );
    var maxSpinner = createTempSpinner( model.maxProperty, canIncreaseMaxProperty, canDecreaseMaxProperty );

    // TODO: Rearrange this on the screen
    this.addChild( new HBox( {
      children: [
        new VBox( {
          children: [
            numeratorSpinner,
            denominatorSpinner
          ],
          spacing: 50
        } ),
        new VBox( {
          children: [
            numeratorText,
            new Line( 0, 0, 80, 0, { stroke: 'black', lineWidth: 8, lineCap: 'round' } ),
            denominatorText
          ],
          spacing: 10
        } ),
        new VBox( {
          children: [
            new Text( 'Max', { font: new PhetFont( 30 ) } ),
            maxText,
            maxSpinner
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
  }

  fractionsIntro.register( 'ProtoScreenView', ProtoScreenView );

  return inherit( ScreenView, ProtoScreenView, {
    step: function( dt ) {
      this.currentView.step( dt );
    }
  } );
} );
