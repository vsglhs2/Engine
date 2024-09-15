import { Environment } from "./base";
import { EMPTY_ENVIRONMENT_KEY, EmptyEnvironment } from "./empty";
import { INPLACE_ENVIRONMENT_KEY, InPlaceCanvasAndHTMLEnvironment } from "./inplace";

export const environmentsRegistry = new Map<string, typeof Environment>();

environmentsRegistry.set(EMPTY_ENVIRONMENT_KEY, EmptyEnvironment);
environmentsRegistry.set(INPLACE_ENVIRONMENT_KEY, InPlaceCanvasAndHTMLEnvironment);
