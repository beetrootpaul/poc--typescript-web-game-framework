import { DrawApi } from "./DrawApi.ts";
import { Framework, type FrameworkOptions } from "./Framework.ts";
import { GameInputEvent } from "./game_input/GameInput.ts";
import { StorageApi } from "./StorageApi.ts";

let framework: Framework;

//  This class is only a facade over other capabilities of this game framework.
//    It serves as a public, global, statically accessible API.
//    Inspiration: [PICO-8's API](https://www.lexaloffle.com/dl/docs/pico-8_manual.html).

// TODO: after name for the framework gets chosen: rename this to the framework name or to its abbreviation
export class PocTsBGFramework {
  // The most important function, has to be called first in order
  //   to properly initialize other fields and variables.
  //

  static init(options: FrameworkOptions): void {
    framework = new Framework(options);
  }

  // Framework's lifecycle methods, exposed for a static access.
  //   Assumption: `init(…)` was called first in order to make `framework` defined.
  //

  static setOnUpdate(onUpdate: () => void) {
    framework.setOnUpdate(onUpdate);
  }

  static setOnDraw(onDraw: () => void): void {
    framework.setOnDraw(onDraw);
  }

  static startGame(onStart?: () => void): void {
    framework.startGame(onStart);
  }

  // The rest of the globally and statically available API.
  //   Assumption: `init(…)` was called first in order to make `framework` defined.
  //

  static frameNumber: number;
  static drawApi: DrawApi;
  static gameInputEvents: Set<GameInputEvent>;
  static storageApi: StorageApi;
}