import { PrintDebug } from "./debug/PrintDebug.ts";
import { Utils } from "./Utils.ts";

export function xy_(x: number, y: number): Xy {
  return new Xy(x, y);
}

export class Xy implements PrintDebug {
  static zero = new Xy(0, 0);

  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // TODO: cover with tests
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  abs(): Xy {
    return new Xy(Math.abs(this.x), Math.abs(this.y));
  }

  floor(): Xy {
    return new Xy(Math.floor(this.x), Math.floor(this.y));
  }

  round(): Xy {
    return new Xy(Math.round(this.x), Math.round(this.y));
  }

  min(): number {
    return Math.min(this.x, this.y);
  }

  clamp(xy1: Xy, xy2: Xy): Xy {
    return new Xy(
      Utils.clamp(xy1.x, this.x, xy2.x),
      Utils.clamp(xy1.y, this.y, xy2.y)
    );
  }

  add(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x + other, this.y + other)
      : new Xy(this.x + other.x, this.y + other.y);
  }

  sub(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x - other, this.y - other)
      : new Xy(this.x - other.x, this.y - other.y);
  }

  mul(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x * other, this.y * other)
      : new Xy(this.x * other.x, this.y * other.y);
  }

  div(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x / other, this.y / other)
      : new Xy(this.x / other.x, this.y / other.y);
  }

  d(): string {
    return `(${this.x},${this.y})`;
  }
}