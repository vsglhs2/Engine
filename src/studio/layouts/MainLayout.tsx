import { FC } from "react";
import { Outlet } from "react-router-dom";
import './AppLayout.Module.scss';
import { Telescope } from "../components";

export const AppLayout: FC = () => {
    return (
        <div className={'layout'}>
            <Outlet />
            <Telescope />
        </div>
    )
};