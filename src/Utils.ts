import { SolidColor } from "./Color.ts";
import { PocTsBGFramework } from "./PocTsBGFramework.ts";
import { Xy, xy_ } from "./Xy.ts";

export class Utils {
  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  }

  // TODO: migrate from Lua
  // function u.boolean_changing_every_nth_second(n)
  //   return ceil(sin(time() * 0.5 / n) / 2) == 1
  // end

  // generates a list of XY to add to a given coordinate in order to get all offsets by 1 pixel in 8 directions
  static get offset8Directions(): Xy[] {
    return [
      xy_(-1, -1),
      xy_(0, -1),
      xy_(1, -1),
      xy_(1, 0),
      xy_(1, 1),
      xy_(0, 1),
      xy_(-1, 1),
      xy_(-1, 0),
    ];
  }

  static measureTextSize(text: string): Xy {
    const font = PocTsBGFramework.drawApi.getFont();
    return font?.sizeOf(text) ?? Xy.zero;
  }

  static printWithOutline(
    text: string,
    canvasXy1: Xy,
    textColor: SolidColor,
    outlineColor: SolidColor
  ): void {
    Utils.offset8Directions.forEach((offset) => {
      PocTsBGFramework.drawApi.print(text, canvasXy1.add(offset), outlineColor);
    });
    PocTsBGFramework.drawApi.print(text, canvasXy1, textColor);
  }

  // to be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`
  static throwError(message: string): never {
    throw Error(message);
  }
}
