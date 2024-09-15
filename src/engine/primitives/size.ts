import { sceneSerializer } from "./serializable";

export default class Size {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

sceneSerializer.registerSerializable(Size, function () {
    return [this.width, this.height];
});