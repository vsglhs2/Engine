import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary } from "@mui/joy";
import { FC } from "react";

export const Tree: FC = () => {
    return (
        <div>
            <AccordionGroup>
                <Accordion>
                    <AccordionSummary>
                        Hello
                    </AccordionSummary>
                    <AccordionDetails>
                        Hello1
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup>            
        </div>
    );
};