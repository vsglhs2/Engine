import { Captured, IController } from "./base";

const emptyArray: string[] = [];

export default class EmptyController implements IController {
    toCaptured(): Captured {
        return {
            keyboard: emptyArray,
            mouse: emptyArray,
        }
    }
}