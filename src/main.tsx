import { createRoot } from 'react-dom/client';
import { App } from './studio/components';

// import CaptureController from "./engine/controller/capture";
// import Loop from "./engine/loop/main";
// import { CanvasRenderer, simpleScene, UIRenderer } from "./sample-game/main";

// const loop = new Loop({
//     fps: 120,
//     renderers: [UIRenderer, CanvasRenderer],
//     controller: new CaptureController(),
// });

// simpleScene.load().then(loop.start);

const rootElement = document.querySelector('#root') as HTMLDivElement;
const root = createRoot(rootElement);

root.render(<App />);
