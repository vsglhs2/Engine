import BaseLoop from "./base";

export default class ManualLoop extends BaseLoop {
    private interval = 16;

    sync(): void {
        this.iterate(this.interval);
    }

    protected override iterate(delta: number) {
        this.prepare();
        this.render();        
    }
}