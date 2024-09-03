import { Project } from "@/engine/project";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary } from "@mui/joy";
import { FC } from "react";

type TreeProps = {
    project: Project;
};

export const Tree: FC<TreeProps> = ({ project }) => {
    const { scenes, name } = project;

    const accordions = scenes.map(scene => (
        <Accordion key={scene.name}>
            <AccordionSummary>
                {scene.name}
            </AccordionSummary>
            <AccordionDetails>
                {scene.name}
            </AccordionDetails>
        </Accordion>
    ))

    return (
        <div>
            <AccordionGroup>
                {accordions}
            </AccordionGroup>            
        </div>
    );
};