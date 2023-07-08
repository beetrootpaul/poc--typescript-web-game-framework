import { GamepadGameInput } from "./GamepadGameInput.ts";
import { KeyboardGameInput } from "./KeyboardGameInput.ts";
import { TouchGameInput } from "./TouchGameInput.ts";

export type GameInputEvent =
  | null
  | "left"
  | "right"
  | "up"
  | "down"
  | "full_screen"
  | "debug_toggle";

export const gameInputEventBehavior: Record<string, { fireOnce?: boolean }> = {
  // TODO: move full_screen out of this set OR move its handling to TouchGameInput and similar ones
  full_screen: { fireOnce: true },
  debug_toggle: { fireOnce: true },
};

type GameInputParams = {
  debugToggleKey?: string;
};

export class GameInput {
  readonly #keyboardGameInput: KeyboardGameInput;
  readonly #touchGameInput: TouchGameInput;
  readonly #gamepadGameInput: GamepadGameInput;

  constructor(params: GameInputParams) {
    this.#keyboardGameInput = new KeyboardGameInput({
      debugToggleKey: params.debugToggleKey,
    });
    this.#touchGameInput = new TouchGameInput();
    this.#gamepadGameInput = new GamepadGameInput();
  }

  startListening() {
    this.#keyboardGameInput.startListening();
    this.#touchGameInput.startListening();
  }

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#keyboardGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#touchGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#gamepadGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }

  consumeFireOnceEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#keyboardGameInput.consumeFireOnceEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }
}
