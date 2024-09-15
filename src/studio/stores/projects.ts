import { makeAutoObservable } from "mobx";
import { Project } from "../../engine/project/project";
import sampleProject from "../../sample-game/project";
import { globalSerializer } from "./serializer";
import { project } from "./project";
import { Scene } from "@/engine/scene/scene";

export class ProjectsStore {
    public projectsRecord: Record<string, Project>;
    public active: Project | undefined;

    constructor () {
        this.projectsRecord = {};

        makeAutoObservable(this);
    }

    // create(name: string, scenes: Scene[]) {
    //     const project = new Project(name);
    //     this.projectsRecord[project.name] = project;
    // }

    add(project: Project) {
        if (project.name in this.projectsRecord)
            throw new Error(`There is already project with [${project.name}] name`);

        this.projectsRecord[project.name] = makeAutoObservable(project);
    }

    activate(name: string) {
        if (!(name in this.projectsRecord))
            throw new Error(`There is no project with [${name}] name`);

        this.active = project.activate(this.projectsRecord[name]);
        globalSerializer.sync();
    }
}

export const projects = new ProjectsStore();
projects.add(sampleProject);
projects.activate(sampleProject.name);
sampleProject.addScene(new Scene(';wsddjs'));