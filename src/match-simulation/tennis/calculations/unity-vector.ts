import { Coordinates, CourtItem, TennisMatchShotType, TennisMatchStrikeZone } from '@core/contracts';
import { mcs } from '../constants';
import { maxUnity } from './init';

export class UVector {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distance(a: UVector, b: UVector) {
    const sq = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
    return Math.sqrt(sq);
  }

  deepCopy() {
    const copy = new UVector(this.x, this.y, this.z);
    return copy;
  }

  project(vec: UVector) {
    return new UVector(vec.x, 0, vec.z);
  }

  multiply(vec: UVector, num: number) {
    const newVec = vec.deepCopy();
    newVec.x *= num;
    newVec.y *= num;
    newVec.z *= num;

    return newVec;
  }

  add(v1: UVector, v2: UVector) {
    return new UVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  substract(v1: UVector, v2: UVector) {
    return new UVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  dot(v1: UVector, v2: UVector) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  magnitude(vec: UVector) {
    const sq = Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
    return Math.sqrt(sq);
  }

  normalize(vec: UVector) {
    return this.multiply(vec, 1 / this.magnitude(vec));
  }

  getStraightLineEndPoint(start: UVector, passingPoint: UVector, length: number) {
    const dir = this.normalize(this.substract(passingPoint, start));
    const endPoint = this.add(start, this.multiply(dir, length));

    return endPoint;
  }

  convertUVToCanvas(vec: UVector, height: number, width: number, item: CourtItem): Coordinates {
    const maxX = maxUnity.x;
    const maxY = maxUnity.y;
    switch (item) {
      case CourtItem.Ball:
        return {
          x: this.toFixedNum(((vec.x / maxX + 1) / 2) * width, 0) - mcs.ballHalfSize,
          y: this.toFixedNum(((1 - vec.z / maxY) / 2) * height, 0) - mcs.ballHalfSize,
        };

      case CourtItem.AI:
      case CourtItem.Player:
        return {
          x: this.toFixedNum(((vec.x / maxX + 1) / 2) * width, 0) - mcs.TShirtXOffset,
          y: this.toFixedNum(((1 - vec.z / maxY) / 2) * height, 0) - mcs.TShirtYOffset,
        };
      case CourtItem.Cannon:
        return {
          x: this.toFixedNum(((vec.x / maxX + 1) / 2) * width, 0) - mcs.CannonXOffset,
          y: this.toFixedNum(((1 - vec.z / maxY) / 2) * height, 0) - mcs.CannonYOffset,
        };
    }
  }

  middlePoint(start: UVector, end: UVector) {
    return new UVector((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
  }

  getShotTypePosition(v: number, shotType?: TennisMatchShotType) {
    return shotType === TennisMatchShotType.Forehand ? v * -1 : v;
  }

  getPlayerSpaceFromZone(strikeZone?: TennisMatchStrikeZone, shotType?: TennisMatchShotType) {
    switch (strikeZone) {
      case TennisMatchStrikeZone.FullStretch:
        return this.getShotTypePosition(1.4, shotType);
      case TennisMatchStrikeZone.Comfort:
        return this.getShotTypePosition(1, shotType);
      case TennisMatchStrikeZone.Body:
        return this.getShotTypePosition(0.5, shotType);

      default:
        return this.getShotTypePosition(1, shotType);
    }
  }

  getVectorOffset(start: UVector, end: UVector, shift: number, paralel: boolean) {
    if (paralel) {
      const vecStartEnd = this.substract(end, start);
      const dir = this.normalize(vecStartEnd);
      const perpendicularDir = new UVector(-dir.z, 0, dir.x);

      return this.multiply(this.normalize(perpendicularDir), shift);
    } else {
      return new UVector(shift, 0, 0);
    }
  }

  getHorizontalPredicatePoint(start: UVector, end: UVector, target: UVector) {
    const vecStartEnd = this.substract(end, start);
    const dirStartEnd = this.normalize(vecStartEnd);
    const vecStartTarget = this.substract(target, start);

    const dist = this.dot(dirStartEnd, vecStartTarget);
    const shift = this.multiply(dirStartEnd, dist);
    const pos = this.add(start, shift);

    return pos;
  }

  toFixedNum(v: number, to = 2) {
    return Number(v.toFixed(to));
  }

  calcX(x: number, width: number) {
    return this.toFixedNum(maxUnity.x * (2 * (x / width) - 1));
  }
  calcY(y: number, height: number) {
    return this.toFixedNum(maxUnity.y * (1 - 2 * (y / height)));
  }
}
