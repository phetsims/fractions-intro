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
    'titleProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'intro': string;
    'introProperty': TReadOnlyProperty<string>;
    'game': string;
    'gameProperty': TReadOnlyProperty<string>;
    'lab': string;
    'labProperty': TReadOnlyProperty<string>;
  }
};

const fractionsIntroStrings = getStringModule( 'FRACTIONS_INTRO' ) as StringsType;

fractionsIntro.register( 'fractionsIntroStrings', fractionsIntroStrings );

export default fractionsIntroStrings;
