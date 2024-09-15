import { Environment, SerializedEnvironment } from "./base";

export class EmptyEnvironment extends Environment {
    constructor () {
        super([]);
    }
    
    async serialize(): Promise<SerializedEnvironment> {
        return {
            key: EMPTY_ENVIRONMENT_KEY,
            shifts: [],
        };
    }
}
export const EMPTY_ENVIRONMENT_KEY = 'environment#empty';