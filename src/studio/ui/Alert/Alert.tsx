import { Alert as JoyAlert, AlertProps as JoyAlertProps } from "@mui/joy";
import { FC } from "react";

type AlertProps = JoyAlertProps;

export const Alert: FC<AlertProps> = ({ 
    size = 'lg',
    variant = 'soft',
    ...props
}) => {
    return (
        <JoyAlert
            size={size}
            variant={variant}
            {...props}
        />
    );
};