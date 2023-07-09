import { Assets } from "../Assets.ts";
import { Color, SolidColor } from "../Color.ts";
import { Sprite } from "../Sprite.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawRectFilled } from "./DrawRectFilled.ts";

export type DrawPixelFn = (xy: Xy, c: Color) => void;

type DrawApiOptions = {
  // TODO: better name to indicate in-out nature of this param?
  mutableCanvasRgbaBytes: Uint8ClampedArray;
  canvasSize: Xy;
  assets: Assets;
};

// `b` in loops in this file stands for a byte (index)
//
export class DrawApi {
  readonly #mutableCanvasRgbaBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;
  readonly #assets: Assets;

  readonly #drawRectFilled: DrawRectFilled;

  #cameraOffset: Xy = xy_(0, 0);

  // Hex representation of a Color is used as this map's keys, because it makes it easier to retrieve mappings with use of string equality
  readonly #spriteColorMapping: Map<string, Color> = new Map();

  constructor(options: DrawApiOptions) {
    this.#mutableCanvasRgbaBytes = options.mutableCanvasRgbaBytes;
    this.#canvasSize = options.canvasSize.round();
    this.#assets = options.assets;

    this.#drawRectFilled = new DrawRectFilled(this.pixel.bind(this));
  }

  // TODO: cover it with tests
  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset.round();
  }

  // TODO: cover it with tests
  clear(color: Color): void {
    if (color instanceof SolidColor) {
      for (
        let pixel = 0;
        pixel < this.#mutableCanvasRgbaBytes.length / 4;
        pixel += 1
      ) {
        const b = pixel * 4;
        this.#mutableCanvasRgbaBytes[b] = color.r;
        this.#mutableCanvasRgbaBytes[b + 1] = color.g;
        this.#mutableCanvasRgbaBytes[b + 2] = color.b;
        this.#mutableCanvasRgbaBytes[b + 3] = 255;
      }
    }
  }

  pixel(xy: Xy, c: Color): void {
    if (!(c instanceof SolidColor)) {
      return;
    }

    const canvasXy = xy.sub(this.#cameraOffset).round();
    if (
      canvasXy.x < 0 ||
      canvasXy.x >= this.#canvasSize.x ||
      canvasXy.y < 0 ||
      canvasXy.y >= this.#canvasSize.y
    ) {
      return;
    }

    let b = (canvasXy.y * this.#canvasSize.x + canvasXy.x) * 4;
    this.#mutableCanvasRgbaBytes[b] = c.r;
    this.#mutableCanvasRgbaBytes[b + 1] = c.g;
    this.#mutableCanvasRgbaBytes[b + 2] = c.b;
    this.#mutableCanvasRgbaBytes[b + 3] = 255;
  }

  rectFilled(xy1: Xy, xy2: Xy, c: SolidColor): void {
    this.#drawRectFilled.draw(xy1, xy2, c);
  }

  // TODO: cover it with tests
  // TODO: maybe pass mapping as param to sprite drawing instead of setting it independently and having to reset it afterwards?
  mapSpriteColor(from: Color, to: Color): void {
    // TODO: consider writing a custom equality check function
    if (from.asRgbaCssHex() === to.asRgbaCssHex()) {
      this.#spriteColorMapping.delete(from.asRgbaCssHex());
    } else {
      this.#spriteColorMapping.set(from.asRgbaCssHex(), to);
    }
  }

  // TODO: implement clipping of the desired sprite size to the real source image area
  // TODO: cover it with tests
  // TODO: make sure the case of sprite.xy2 < sprite.xy1 is handled correctly
  sprite(spriteImageUrl: string, sprite: Sprite, targetXy1: Xy): void {
    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = this.#assets.getImage(spriteImageUrl);
    const imgBytesPerColor = 4;
    const baseOffset =
      (targetXy1.y - sprite.xy1.y) * this.#canvasSize.x +
      (targetXy1.x - sprite.xy1.x);
    for (let px = 0; px < imgBytes.length / imgBytesPerColor; px += 1) {
      const imgX = px % imgW;
      const imgY = Math.floor(px / imgW);
      if (
        imgX >= sprite.xy1.x &&
        imgX < sprite.xy2.x &&
        imgY >= sprite.xy1.y &&
        imgY < sprite.xy2.y
      ) {
        const offset = baseOffset + imgY * this.#canvasSize.x;
        const target = (offset + imgX) * 4;
        const idx = px * imgBytesPerColor;
        // TODO: how to make it clearer that we simplify transparency here to below and above 127?
        if (imgBytes[idx + 3] > 127) {
          // TODO: refactor?
          let c: Color = new SolidColor(
            imgBytes[idx],
            imgBytes[idx + 1],
            imgBytes[idx + 2]
          );
          c = this.#spriteColorMapping.get(c.asRgbaCssHex()) ?? c;
          if (c instanceof SolidColor) {
            // TODO: consider reusing this.pixel(…)
            const adjustedTarget =
              target -
              (this.#cameraOffset.y * this.#canvasSize.x +
                this.#cameraOffset.x) *
                4;
            this.#mutableCanvasRgbaBytes[adjustedTarget] = c.r;
            this.#mutableCanvasRgbaBytes[adjustedTarget + 1] = c.g;
            this.#mutableCanvasRgbaBytes[adjustedTarget + 2] = c.b;
            this.#mutableCanvasRgbaBytes[adjustedTarget + 3] = 255;
          }
        }
      }
    }
  }
}
