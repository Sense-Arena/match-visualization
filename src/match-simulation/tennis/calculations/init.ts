import { UVector } from './unity-vector';

export const UwU = new UVector(0, 0, 0);
export const up = new UVector(0, 1, 0);

export const maxUnity = {
  x: 9.02,
  y: 15.385,
  cX: 5.46,
  cY: 11.86,
};

export const topCorner = (v: UVector) => new UVector(v.x > 0 ? -maxUnity.x : maxUnity.x, 0, maxUnity.y);
export const bottomCorner = (v: UVector) => new UVector(v.x > 0 ? -maxUnity.x : maxUnity.x, 0, -maxUnity.y);
