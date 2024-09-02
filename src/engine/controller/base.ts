export type Captured = {
    keyboard: string[];
    mouse: string[];
};

export interface IController {
    toCaptured(): Captured;
}