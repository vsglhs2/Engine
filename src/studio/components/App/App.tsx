import React, { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "../../routes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/studio/locales";

const router = createBrowserRouter(routes);

export const App: FC = () => {
    return (
        <React.StrictMode>
            <I18nextProvider i18n={i18n}></I18nextProvider>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
};