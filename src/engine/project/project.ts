import { Environment, EmptyEnvironment } from "../environment";
import { Scene } from "../scene/scene";

type ProjectOptions<Env extends Environment = Environment> = {
    scenes: Scene<Env>[];
    environment: Env;
};

export class Project<Env extends Environment = Environment> {
    static async fromFile(file: File): Promise<Project> {
        return new Project(file.name);
    }

    static async fromDirectory(files: File[]): Promise<Project> {
        const rootName = files[0].name;
        return new Project(rootName);
    }

    static async toFile(project: Project): Promise<File> {
        return new File([], project.name);
    }

    static async toDirectory(project: Project): Promise<File[]> {
        const file = new File([], project.name);
        return [file];
    }

    private scenesRecord: Record<string, Scene<Env>>;
    public name: string;
    public environment: Env;

    constructor (name: string, options?: ProjectOptions<Env>) {
        this.name = name;
        const assignedOptions: ProjectOptions<Env> = {
            scenes: [],
            environment: new EmptyEnvironment() as Env,
            ...options,
        };

        const { scenes, environment } = assignedOptions;

        this.scenesRecord = scenes.reduce<Record<string, Scene<Env>>>(
            (record, scene) => {
                if (!(scene.name in record)) record[scene.name] = scene;
                scene.environment = environment;

                return record;
            }, {}
        );
        this.environment = environment;
    }

    public addScene(scene: Scene<Env>) {
        if (scene.name in this.scenesRecord)
            throw new Error(`Project [${this.name}] already has scene with name [${scene.name}]`);

        this.scenesRecord[scene.name] = scene;
        scene.environment = this.environment;
    }

    public removeScene(scene: Scene<Env>) {
        if (!(scene.name in this.scenesRecord))
            throw new Error(`There is no scene with name [${scene.name}] in project [${this.name}]`);
        
        delete this.scenesRecord[scene.name];
        scene.destroy();
    }

    public scenes() {
        return Object.values(this.scenesRecord);
    }

    public scene(name: string): Scene<Env> | undefined {
        return this.scenesRecord[name];
    }

    public sceneNames() {
        return Object.keys(this.scenesRecord);
    }
}
