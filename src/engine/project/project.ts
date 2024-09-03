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

    public name: string;
    public scenes: Scene[];
    public environment: Env;

    constructor (name: string, options?: ProjectOptions<Env>) {
        this.name = name;
        this.scenes = options?.scenes ?? [];
        this.environment = options?.environment ?? new EmptyEnvironment() as Env;
    }
}
