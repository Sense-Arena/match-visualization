import { style } from '@vanilla-extract/css';

export const cardStyles = style({
  width: 'fit-content',
  paddingBottom: '1.5rem',
  '@media': {
    'screen and (max-width: 500px)': {
      width: 'unset',
    },
  },
});
