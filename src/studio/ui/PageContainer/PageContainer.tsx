import { Box } from "@mui/joy";
import { FC, forwardRef, HTMLAttributes, PropsWithChildren } from "react";
import './PageContainer.Module.scss';

type PageContainerProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

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