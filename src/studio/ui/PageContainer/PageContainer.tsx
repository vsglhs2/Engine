import { Box } from "@mui/joy";
import { FC, PropsWithChildren } from "react";
import './PageContainer.Module.scss';

type PageContainerProps = PropsWithChildren;

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
    return (
        <Box className="page-container">
            {children}
        </Box>
    );
};