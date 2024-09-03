import Renderer from "../render/renderer/base";

export abstract class Environment {
    public renderers: Renderer[] = [];
}