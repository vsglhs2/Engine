import Canvas2DRenderer from "../render/renderer/canvas2d/base";
import HTMLRenderer from "../render/renderer/html/renderer";
import { Environment, SerializedEnvironment } from "./base";

export class InPlaceCanvasAndHTMLEnvironment extends Environment {
    constructor() {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.style.position = 'absolute';
        canvas.style.left ='0';
        canvas.style.top = '0';
        canvas.style.width ='100%';
        canvas.style.height = '100%';
        canvas.style.userSelect = 'none';

        const root = document.createElement("div") as HTMLDivElement;
        canvas.style.position = 'absolute';
        canvas.style.left ='0';
        canvas.style.top = '0';
        canvas.style.width ='100%';
        canvas.style.height = '100%';
        canvas.style.userSelect = 'none';
        canvas.style.pointerEvents = 'none';
        
        const CanvasRenderer = new Canvas2DRenderer(canvas);
        const UIRenderer = new HTMLRenderer(root);

        super([CanvasRenderer, UIRenderer]);
    }

    async serialize(): Promise<SerializedEnvironment> {
        return {
            key: INPLACE_ENVIRONMENT_KEY,
            shifts: [],
        };
    }
}

export const INPLACE_ENVIRONMENT_KEY = 'environment#inplace';