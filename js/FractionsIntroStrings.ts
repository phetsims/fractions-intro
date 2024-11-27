// Copyright 2020-2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import fractionsIntro from './fractionsIntro.js';

type StringsType = {
  'fractions-intro': {
    'title': string;
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'intro': string;
    'introStringProperty': LocalizedStringProperty;
    'game': string;
    'gameStringProperty': LocalizedStringProperty;
    'lab': string;
    'labStringProperty': LocalizedStringProperty;
  }
};

const FractionsIntroStrings = getStringModule( 'FRACTIONS_INTRO' ) as StringsType;

fractionsIntro.register( 'FractionsIntroStrings', FractionsIntroStrings );

export default FractionsIntroStrings;
