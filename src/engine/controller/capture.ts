import { Captured, IController } from "./base";

export default class CaptureController implements IController {
    private captured: Captured;
    private controller: AbortController;


    constructor(root = document.body) {
        this.controller = new AbortController();
        this.captured = {
            keyboard: [],
            mouse: [],
        };

        root.addEventListener("keydown", (e) => {
            if (this.captured.keyboard.includes(e.key)) return;
            console.log("heydown: ", e.key, this.captured.keyboard);

            this.captured.keyboard.push(e.key);
        }, {
            signal: this.controller.signal,
        });

        root.addEventListener("keyup", (e) => {
            const index = this.captured.keyboard.findIndex((k) => k === e.key);
            console.log("heyup: ", e.key, this.captured.keyboard);

            this.captured.keyboard.splice(index, 1);
        }, {
            signal: this.controller.signal,
        });
    }

    destroy(): void {
        this.controller.abort();
    }

    toCaptured() {
        return this.captured;
    }
}
