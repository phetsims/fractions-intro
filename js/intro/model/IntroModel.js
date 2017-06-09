// Copyright 2017, University of Colorado Boulder

/**
 * Main model of the simulation, which tracks the numerator, denominator and maximum value as axon properties.
 *
 * @author Dusty Cole (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ContainerSet = require( 'FRACTIONS_INTRO/intro/model/ContainerSet' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var fractionsIntro = require( 'FRACTIONS_INTRO/fractionsIntro' );
  var IntroConstants = require( 'FRACTIONS_INTRO/intro/IntroConstants' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Piece = require( 'FRACTIONS_INTRO/intro/model/Piece' );
  var Representation = require( 'FRACTIONS_INTRO/intro/model/Representation' );

  /**
   * @constructor
   */
  function IntroModel() {

    var self = this;
    // @public {Property.<number>}
    this.denominatorProperty = new NumberProperty( IntroConstants.DENOMINATOR_RANGE.defaultValue );

    // @public {Property.<number>}
    this.numeratorProperty = new NumberProperty( 0 );

    // @public {Property.<Representation>}
    this.representationProperty = new Property( Representation.CIRCLE );

    // @public {Property.<number>}
    this.maxProperty = new NumberProperty( IntroConstants.MAX_RANGE.defaultValue );

    // @public (read-only) {Property.<number>}
    this.fractionProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        return numerator / denominator;
      } );

    // @public (read-only) {Property.<number>}
    this.segmentProperty = new DerivedProperty( [ this.denominatorProperty ],
      function( denominator ) {
        return 1 / denominator;
      } );

    // @private
    this.containerSet = new ContainerSet( this.numeratorProperty, this.denominatorProperty,
      this.maxProperty );

    // @public a collection of piece
    this.pieces = new ObservableArray();

    // present for the lifetime of the simulation
    // responsible for creating pieces emanating or returning to the bucket
    this.numeratorProperty.link( function( numerator, oldNumerator ) {

      var difference = numerator - oldNumerator;

      // adding a piece that will be animated from the bucket to a cell for the difference
      if ( difference > 0 ) {

        for ( var i = difference; i > 0; i-- ) {
          if ( self.containerSet.getEmptyCellsCount() > 0 ) {
            self.addAnimatingPieceInBucket();
          }
        }
      }

      // a piece will fly from a cell to the bucket each time for the difference
      if ( difference < 0 ) {

        for ( var j = difference; j < 0; j++ ) {
          if ( self.containerSet.getFilledCellsCount() > 0 ) {
            self.addAnimatingPieceAtCell();
          }
        }
      }
    } );

    // link numeratorProperty to denominatorProperty and to maxNumberOfUnits
    /* Property.multilink( [ this.denominatorProperty, this.numeratorProperty, this.maxProperty ],
     function( denominator, numerator, max ) {

     // If the maximum decreases, the numerator may also need to be decreased to compensate
     if ( numerator / denominator > max ) {

     // decreases numeratorProperty as dependent on the max and denominator
     self.numeratorProperty.value = denominator * max;
     }
     } );*/
  }

  fractionsIntro.register( 'IntroModel', IntroModel );

  return inherit( Object, IntroModel, {

    /**
     * Reset
     * @public
     */
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
      this.maxProperty.reset();
      this.representationProperty.reset();
      this.pieces.reset();
    },

    /**
     * create a piece in the bucket that will be animated to an empty cell
     * The chosen empty cell is the 'closest' empty cell, that is from the
     * cell and container with the lowest indices
     * @private
     */
    addAnimatingPieceInBucket: function() {

      var self = this;

      // find an empty destination cell for the piece
      var destinationContainer = this.containerSet.getNextNonFullContainer();
      var destinationCell = destinationContainer.getNextEmptyCell();

      assert && assert( destinationCell, 'destination cell does not exist' );

      // no visual affect while in numberLineNode but update the containerSet.
      if ( this.representationProperty.value === Representation.NUMBER_LINE ) {

        destinationCell.isFilledProperty.value = true;
      }
      else {


        // create a piece at the location of the bucket
        var piece = new Piece( {
          position: IntroConstants.BUCKET_POSITION,
          dragging: false
        } );

        // add the piece to the Observable array to notify the view
        this.pieces.add( piece );

        // lock in the destination cell to the piece
        // a listener to cellToProperty will instantiate an animation
        piece.cellToProperty.value = destinationCell;

        // TODO: very round about way to force update view once the animation is complete
        piece.updateCellsEmitter.addListener( function() {
          self.containerSet.containersEmitter.emit();
        } );
      }

    },

    /**
     * adds a piece at the location of a filled cell and animate it toward
     * the bucket
     * The location of the filled cell is chosen as the last filled cell, i.e.
     * the filled cell with the highest container and cell indices.
     * @private
     */
    addAnimatingPieceAtCell: function() {

      // find a filled source cell for the piece
      var sourceContainer = this.containerSet.getLastNonEmptyContainer();
      var sourceCell = sourceContainer.getNextFilledCell();

      // no visual affect while in numberLineNode but update the containerSet.
      if ( this.representationProperty.value === Representation.NUMBER_LINE ) {

        sourceCell.isFilledProperty.value = false;
      }
      else {


        // create a piece at the position of the source cell
        var piece = new Piece( {
          position: sourceCell.positionProperty.value,
          dragging: false
        } );

        // add the piece to the observable array to notify the view
        this.pieces.add( piece );

        // lock in the origin cell to the piece
        // a listener to cellFromProperty will instantiate an animation
        piece.cellFromProperty.value = sourceCell;

      }
      // forces an update on the view
      this.containerSet.containersEmitter.emit();
    }

  } );
} );