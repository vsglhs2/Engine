import BaseLoop, { BaseConfiguration } from "./base";

export type LoopConfiguration = BaseConfiguration & {
    fps: number;
}

export default class Loop extends BaseLoop {
    private fps: number;
    private startTime: number;
    private interval: number;
    private isDone: boolean;

    constructor (config: LoopConfiguration) {
        super(config);

        this.fps = config.fps;
        this.interval = 1000 / this.fps;
        this.startTime = Date.now();
        this.isDone = true;
    }

    public start(): void {
        let previous = this.startTime;
        const interval = this.interval;
        this.isDone = false;

        const loop = function (this: Loop) {
            const current = Date.now();
            let delta = current - previous;

            if (this.isDone) return;
            requestAnimationFrame(loop);

            if (delta < interval) return;

            previous = current;
            this.iterate(delta);
        }.bind(this);

        loop();
    }

    public stop(): void {
        this.isDone = true;
        this.prepare();
    }
}