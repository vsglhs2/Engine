import { intersectsWith } from "../engine/base/collider/square/simple";
import Placeable from "../engine/base/placeable/base";
import ManualLoop from "../engine/loop/manual";
import Point from "../engine/primitives/point";
import Size from "../engine/primitives/size";
import SceneManager from "../engine/scene/manager";
import { Scene } from "../engine/scene/scene";
import { scene as simpleScene } from "../sample-game/main";
import CaptureController from "../engine/controller/capture";
import Loop from "../engine/loop/main";
import { Realms } from "../engine/realm";
import make from "../engine/entity/make";
import Entity from "../engine/entity/entity";
import { mapPrototypeChain } from "../engine/decorators/utils/prototype";

const manager = new SceneManager();
const loop = new ManualLoop({
    renderers: [CanvasRenderer]
});

const playButton = document.getElementById('playButton') as HTMLButtonElement;
const pauseButton = document.getElementById('pauseButton') as HTMLButtonElement;

const sceneSelect = document.getElementById('sceneSelect') as HTMLSelectElement;
const sceneButton = document.getElementById('sceneButton') as HTMLButtonElement;
const sceneInput = document.getElementById('sceneInput') as HTMLInputElement;
const sceneActive = document.getElementById('sceneActive') as HTMLSpanElement;

const entitiesList = document.getElementById('entitiesList') as HTMLDivElement;
const rightList = document.getElementById('rightList') as HTMLDivElement;

const { Serializer } = Realms.active();

const mouseContext: {
    clicked: boolean;
    prev: {
        x: number;
        y: number;
    },
    shift: {
        x: number;
        y: number;
    }
    entity?: Placeable;
    entity2?: Placeable;
} = {
    clicked: false,
    prev: {
        x: 0,
        y: 0,
    },
    shift: {
        x: 0,
        y: 0,
    },
};

wrapScene(simpleScene.name);
switchScene(simpleScene);

function wrapScene(sceneName: string) {
    const option = document.createElement('option');
    option.className = 'scene-item';
    option.value = sceneName;
    option.innerText = sceneName;

    sceneSelect.append(option);
    sceneSelect.value = sceneName;

    manager.add(simpleScene.name, simpleScene);
}

function makeScene(sceneName: string) {
    const scene = new Scene(sceneName);
    wrapScene(sceneName);
    manager.add(sceneName, scene);

    return scene;
}

sceneButton.addEventListener('click', () => {
    const sceneName = sceneInput.value;
    if (!sceneName) {
        alert('There must be at least one character in scene name');
        return;
    }

    const scene = makeScene(sceneName);
    switchScene(scene);
});

sceneSelect.addEventListener('change', function (this: { value: string }) {
    const selectedSceneName = this.value;

    manager.active = selectedSceneName;
    sceneActive.innerText = selectedSceneName;
});

function switchScene(scene?: Scene) {
    entitiesList.innerHTML = '';
    rightList.innerHTML = '';

    if (!scene) {
        sceneActive.innerText = 'No scene selected';

        return;
    }

    manager.active = scene.name;
    sceneActive.innerText = scene.name;

    const entries = Array.from(Serializer.keys);

    const entitiesElements = entries.map(([Entity, name]) => {
            const root = document.createElement('div');
            root.className = 'entities-item';
            root.innerText = name;

            root.addEventListener('click', () => {
                const entity = make(Entity);

                loop.sync();

                if (manager.active) {
                    manager.active.entities.push(entity);
                    updateScene(manager.active);
                }

            });

            return root;
        });
    entitiesList.append(...entitiesElements);

    updateScene(scene);
}

// По идеи, всё, что указывается в студии, передается в конструктор Entity
// Нужно написать сериалайзеры, которые позволят устанавливать значения переменных

function updateScene(scene: Scene) {
    rightList.innerHTML = '';
    const entities = mouseContext.entity2 ? [
        mouseContext.entity2, 
        ...Object.values(mouseContext.entity2).filter(d => d instanceof Entity)
    ] : scene.entities;

    for (const entity of entities) {
        const wrapper = document.createElement('div');
        wrapper.className = 'entity-wrapper';

        const exposed = mapPrototypeChain(entity.constructor, (target) => {
            return Serializer.exposed.get(target);
        }).filter(Boolean).reduceRight((acc, cur) => {
            return {
                ...acc,
                ...cur,
            };
        }, {});
        if (!(exposed)) continue;

        const content = Object.entries(exposed).map(([key, as]) => {
                const prop = entity[key];

                const wrapper = document.createElement('div') as HTMLDivElement;
                wrapper.append(`${key}: `);

                const input = document.createElement('input') as HTMLInputElement;
                input.className = 'entity__input';
                input.value = JSON.stringify(prop, (k, v) => {
                    if (k === 'parent') return '[parent: ' + v?.constructor.name;
                    return v;
                });

                input.addEventListener('keydown', function (this, e) {
                    if (e.key !== 'Enter') return;

                    const newValue = this.value;
                    const parsed = JSON.parse(newValue);
                    if (typeof entity[key] !== 'object') entity[key] = parsed;
                    else Object.assign(entity[key], parsed);

                    loop.sync();
                });
                wrapper.append(input)

                return wrapper;
            });

        wrapper.insertAdjacentHTML('beforeend', `
            <div class='entity__name'>${entity.constructor.name}</div>
            <div class='entity__content'></div>
        `);
        const contentElement = wrapper.querySelector('.entity__content') as HTMLDivElement;
        contentElement.append(...content);
        rightList.append(wrapper);

        loop.sync();
    }
}

function findEntityMouseHoverOn(x: number, y: number): Placeable | undefined {
    const { Entities } = Realms.active();
    for (const entity of Entities.entities.keys()) {
        if (!(entity instanceof Placeable)) continue;

        const isIntersected = intersectsWith({
            position: new Point(x, y),
            size: new Size(1, 1),
        }, entity);

        if (isIntersected) return entity as Placeable;
    }
}

document.body.addEventListener('dblclick', e => {
    mouseContext.clicked = true;
    mouseContext.entity2 = findEntityMouseHoverOn(e.x, e.y)
    if (!mouseContext.entity2) return;

    mouseContext.shift.x = e.x - mouseContext.entity2.globalPosition.x;
    mouseContext.shift.y = e.y - mouseContext.entity2.globalPosition.y;

    updateScene(manager.active);
});

document.body.addEventListener('mousedown', e => {
    if (mouseContext.entity2) mouseContext.entity2 = undefined;

    mouseContext.clicked = true;
    mouseContext.entity = findEntityMouseHoverOn(e.x, e.y)
    if (!mouseContext.entity) return;

    mouseContext.shift.x = e.x - mouseContext.entity.globalPosition.x;
    mouseContext.shift.y = e.y - mouseContext.entity.globalPosition.y;
});

document.body.addEventListener('mouseup', e => {
    mouseContext.clicked = false;

    if (e.button === 1) {
        mouseContext.entity?.destroy();
        loop.sync();
    }

    mouseContext.entity = undefined;
});

document.body.addEventListener('mousemove', e => {
    if (!mouseContext.clicked) return;

    const entity = mouseContext.entity;
    if (!entity) return;

    mouseContext.prev.x = e.x;
    mouseContext.prev.y = e.y;

    entity.moveTo(new Point(e.x, e.y).toShiftedBy(new Point(-mouseContext.shift.x, -mouseContext.shift.y)));
    loop.sync();

    updateScene(manager.active)
});

const playLoop = new Loop({
    fps: 120,
    controller: new CaptureController(),
    renderers: [UIRenderer, CanvasRenderer],
});

playButton.addEventListener('click', () => {
    playLoop.start();
});

pauseButton.addEventListener('click', () => {
    playLoop.stop();

    // Временно, убрать, когда сделаю parent/children
    UIRenderer.clearRenderables();
    CanvasRenderer.clearRenderables();
    Realms.active().Entities.entities.clear()

    manager.active?.reload();
    loop.sync();
});

// Сделать удаление объектов
// Сделать сохранение объектов на сцене между переключениями
// Добавить изменение размеров объектов
// Добавить добавление дочерних элементов к объекту

// add multithreading support (execute scene in one thread, collisions in another, etc...)