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
     * create and add a piece to the observable array
     * @public
     */
    createPiece: function( options ) {
      this.pieces.add( new Piece( options ) );
    },

    /**
     * create a piece in the bucket that will be animated to an empty cell
     * The chosen empty cell is the 'closest' empty cell, that is from the
     * cell and container with the lowest indices
     * @private
     */
    addAnimatingPieceInBucket: function() {

      var self = this;

      // check that there is an empty cell
      if ( this.containerSet.getEmptyCellsCount() > 0 ) {

        // find an empty destination cell for the piece
        var destinationContainer = this.containerSet.getNextNonFullContainer();
        var destinationCell = destinationContainer.getNextEmptyCell();

        assert && assert( destinationCell, 'destination cell does not exist' );

        // no visual affect while in numberLineNode but update the containerSet.
        if ( this.representationProperty.value === Representation.NUMBER_LINE ) {

          destinationCell.isFilledProperty.value = true;
          self.containerSet.updatedContainersEmitter.emit();
        }
        else {


          // TODO use createPiece pattern (See #44)

          // create a piece at the location of the bucket
          var piece = new Piece( {
            position: IntroConstants.BUCKET_POSITION,
            dragging: false,
            cellTo: destinationCell //   destination cell for the animation
          } );

          // add the piece to the Observable array to notify the view
          this.pieces.add( piece );

          // TODO: very round about way to force update view once the animation is complete
          piece.updateCellsEmitter.addListener( function() {
            self.containerSet.updatedContainersEmitter.emit();
          } );
        }
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

      // check that there is at least one filled cell
      if ( this.containerSet.getFilledCellsCount() > 0 ) {

        // find a filled source cell for the piece
        var sourceContainer = this.containerSet.getLastNonEmptyContainer();
        var sourceCell = sourceContainer.getNextFilledCell();

        // no visual affect while in numberLineNode but update the containerSet.
        if ( this.representationProperty.value === Representation.NUMBER_LINE ) {

          sourceCell.isFilledProperty.value = false;
        }
        else {

          this.createPiece( {
            position: sourceCell.positionProperty.value,
            dragging: false,
            cellFrom: sourceCell // the cell the piece comes from
          } );
        }

        // forces an update on the view
        this.containerSet.updatedContainersEmitter.emit();

      }
    },
    /**
     * removes a container from the containerSet, takes removed containers filled cells and relocates them if possible
     * animates cells that cannot be relocated to bucket, updates max Property
     * @public
     */
    removeContainer: function() {
      var self = this;

      // get container from the end of the array.
      var lastContainer = this.containerSet.containers[ this.containerSet.containers.length - 1 ];

      //  how many filled cells in the last container could be relocated
      var potentialCellsToToggle = lastContainer.getFilledCellsCount();

      // how many empty cells in containerSet not including the empty cells of the last container
      var availableEmptyCells = this.containerSet.getEmptyCellsCount() - lastContainer.getEmptyCellsCount();

      // find the number of cells to toggle in container set not including the last container
      var numberOfCellsToFill = availableEmptyCells >= potentialCellsToToggle ? potentialCellsToToggle : availableEmptyCells;

      // cells to move to the bucket
      var cellsToAnimate = potentialCellsToToggle - numberOfCellsToFill;

      // move those cells to the bucket
      if ( cellsToAnimate > 0 ) {
        for ( var i = 0; i < cellsToAnimate; i++ ) {
          self.addAnimatingPieceAtCell();
        }
      }

      // update max property value
      this.maxProperty.value = this.maxProperty.value - 1;

      // remove the container from the container set
      this.containerSet.containers.splice( this.containerSet.containers.length - 1, 1 );

      // 'move' filled cells of removed container to empty cells of remaining containers
      this.containerSet.toggleIsFilledTo( numberOfCellsToFill, true );
      this.containerSet.updatedContainersEmitter.emit();

    },
    /**
     * adds a container to the containerset, updates maxProperty value
     * @public
     */
    addContainer: function() {

      this.maxProperty.value = this.maxProperty.value + 1;
      this.containerSet.addContainers( 1 );
      this.containerSet.updatedContainersEmitter.emit();
    },
    /**
     * updates containerset to reflect numeratorProperty.value set by numberlinenode
     * @public
     */
    fixDisparity: function() {
      var self = this;
      var disparity = this.numeratorProperty.value - this.containerSet.getFilledCellsCount();
      if ( disparity > 0 ) {
        for ( var i = 0; i < disparity; i++ ) {
          self.addAnimatingPieceInBucket();
        }
      }
      else {
        for ( var j = disparity; j < 0; j++ ) {
          self.addAnimatingPieceAtCell();
        }
      }
    }
  } );
} );