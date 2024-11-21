import { Box, BoxProps } from "@mui/joy";
import { forwardRef, PropsWithChildren } from "react";
import './PageContainer.Module.scss';

type PageContainerProps = BoxProps & PropsWithChildren;

export const PageContainer = forwardRef<
    HTMLDivElement,
    PageContainerProps
>(({ children, ...props }, ref) => {
    return (
        <Box ref={ref} className="page-container" {...props}>
            {children}
        </Box>
    );
});