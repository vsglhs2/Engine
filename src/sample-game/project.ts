import { Project } from "@/engine/project";
import scene from "./scene";
import { InPlaceCanvasAndHTMLEnvironment } from "@/engine/environment";

const project = new Project('hello project', {
    scenes: [scene],
    environment: new InPlaceCanvasAndHTMLEnvironment(),
});

export default project;