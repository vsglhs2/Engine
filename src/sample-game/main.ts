
import Loop from "@/engine/loop/main";
import project from "./project";
import CaptureController from "@/engine/controller/capture";
import MountableRenderer from "@/engine/render/renderer/mountable";

const [scene] = project.scenes();
scene.load();
const { Entities } = scene.realm;
const { environment } = scene;

const loop = new Loop({
    fps: 120,
    controller: new CaptureController(),
    entities: Entities,
    renderers: environment.renderers,
});

const root = document.querySelector('#root') as HTMLDivElement;
const mountables = environment.renderers
    .filter(renderer => renderer instanceof MountableRenderer);
mountables.forEach(mountable => mountable.mount(root));

loop.start();

// TODO: починить неправильное определение size у canvas'а