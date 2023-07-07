import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const courtWrap = style({
  position: 'relative',
  display: 'flex',
  height: '81vh',
  '@media': {
    'screen and (max-width: 500px)': {
      height: 'unset',
    },
  },
});
const tennisCourt = style({
  maxWidth: '100%',
  maxHeight: '100%',
  userSelect: 'none',
  pointerEvents: 'none',
});

const sideTextWrap = styleVariants({
  top: {
    margin: '0 1.5rem .5rem',
  },
  bottom: {
    margin: '.5rem 1.5rem .75rem',
  },
});

const ddItem = style({
  position: 'absolute',
  zIndex: 1,
});
const oldItem = style({
  position: 'absolute',
  zIndex: 1,
  opacity: 0.35,
  pointerEvents: 'none',
});

const dragging = recipe({
  base: {
    cursor: 'grab',
  },
  variants: {
    isDragging: {
      true: {
        cursor: 'grabbing',
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
      false: {
        zIndex: 3,
      },
    },
    banned: {
      true: {
        opacity: 0.2,
        cursor: 'not-allowed',
      },
    },
  },
});

const pulseBall = keyframes({
  '0%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(219, 227, 58, 0.7)',
    opacity: '.2',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 10px rgba(219, 227, 58, 0)',
    opacity: '1',
  },
  '100%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(219, 227, 58, 0)',
    opacity: '.2',
  },
});
const pulsePlayer = keyframes({
  '0%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(255, 195, 48, 0.7)',
    opacity: '.2',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 10px rgba(255, 195, 48, 0)',
    opacity: '1',
  },
  '100%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(255, 195, 48, 0)',
    opacity: '.2',
  },
});
const pulseAI = keyframes({
  '0%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(77, 107, 205, 0.7)',
    opacity: '.2',
  },
  '70%': {
    transform: 'scale(1)',
    boxShadow: '0 0 0 10px rgba(77, 107, 205, 0)',
    opacity: '1',
  },
  '100%': {
    transform: 'scale(.95)',
    boxShadow: '0 0 0 0 rgba(77, 107, 205, 0)',
    opacity: '.2',
  },
});

const pulsingAnimation = recipe({
  base: {},
  variants: {
    pulse: {
      ball: {
        boxShadow: '0 0 0 0 rgba(219, 227, 58, 1)',
        animation: `${pulseBall} 2s infinite`,
        borderRadius: '50%',
      },
      player: {
        boxShadow: '0 0 0 0 rgba(255, 195, 48, 1)',
        animation: `${pulsePlayer} 2s infinite`,
        borderRadius: '4px',
      },
      ai: {
        boxShadow: '0 0 0 0 rgba(77, 107, 205, 1)',
        animation: `${pulseAI} 2s infinite`,
        borderRadius: '4px',
      },
    },
  },
});

const head = style({
  textAlign: 'center',
  marginBottom: '1rem',
});

const selectWidth = style({
  width: '190px',
});
const loading = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
});

const mb1 = style({
  marginBottom: '1rem',
});

const hint = style({
  position: 'absolute',
  top: '50%',
  left: '5%',
  transform: `translate(-5%, -50%) !important`,
});

const btnsGroup = style({
  margin: 'auto',
});

export const stStyles = {
  tennisCourt,
  courtWrap,
  ddItem,
  dragging,
  head,
  sideTextWrap,
  pulsingAnimation,
  selectWidth,
  loading,
  oldItem,
  mb1,
  btnsGroup,
  hint,
};
