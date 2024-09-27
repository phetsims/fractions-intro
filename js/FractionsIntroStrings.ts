// Copyright 2020-2024, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
/* @formatter:off */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
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
