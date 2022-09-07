// Copyright 2020-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import fractionsIntro from './fractionsIntro.js';

type StringsType = {
  'fractions-intro': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'intro': string;
    'introStringProperty': TReadOnlyProperty<string>;
    'game': string;
    'gameStringProperty': TReadOnlyProperty<string>;
    'lab': string;
    'labStringProperty': TReadOnlyProperty<string>;
  }
};

const FractionsIntroStrings = getStringModule( 'FRACTIONS_INTRO' ) as StringsType;

fractionsIntro.register( 'FractionsIntroStrings', FractionsIntroStrings );

export default FractionsIntroStrings;