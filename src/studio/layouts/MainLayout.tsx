import { FC } from "react";
import { Outlet } from "react-router-dom";
import './AppLayout.Module.scss';

export const AppLayout: FC = () => {
    return (
        <div className={'layout'}>
            <Outlet />
        </div>
    )
};