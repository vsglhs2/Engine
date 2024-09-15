import { Project } from "@/engine/project/project";
import { action, isObservableObject, makeAutoObservable, makeObservable, observable } from "mobx";

// THINK: convert it like RealmStore?

export class ProjectStore {
    public project?: Project;
    public serializedRecord: Record<string, string>;

    constructor () {
        this.serializedRecord = {};
        
        makeObservable(this, {
            project: observable,
            serializedRecord: observable,
            activate: action,
        });
    }

    activate(project: Project) {
        this.serializedRecord = {};
        this.project = isObservableObject(project) ? project : makeAutoObservable(project);

        return this.project;
    }
}

export const project = new ProjectStore();