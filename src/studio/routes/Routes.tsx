import { createRoutesFromElements, Navigate, Route } from "react-router-dom";
import { app } from "./loaders";
import { Scene, Studio } from "../pages";
import { AppLayout } from "../layouts/MainLayout";

export const routes = createRoutesFromElements(
    <Route loader={app}>
        <Route element={<AppLayout />}>
            <Route path="studio" element={<Studio />} />
            <Route path="scene" element={<Scene />} />
            <Route path="*" element={<Navigate to="/studio" />} />
        </Route>

    </Route>
);