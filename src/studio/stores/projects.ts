import { makeAutoObservable } from "mobx";
import { Project } from "../../engine/project/project";
import { project } from "../../sample-game/main";

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

        this.projectsRecord[project.name] = project;
    }

    activate(name: string) {
        if (!(project.name in this.projectsRecord))
            throw new Error(`There is no project with [${project.name}] name`);

        this.active = this.projectsRecord[name];
    }
}

export const projects = new ProjectsStore();
projects.add(project);
projects.activate(project.name);