import { FC, useEffect } from "react";
import { Layout, TopBar } from "../../components";
import './Studio.Module.scss';
import { observer } from "mobx-react-lite";
import { projects } from "../../stores";
import { useStudioConfig } from "./use-studio-config";
import { Alert, PageContainer } from "@/studio/ui";
import { useTranslation } from "react-i18next";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Entity from "@/engine/entity/entity";

export const Studio: FC = observer(() => {
    const project = projects.active;
    const config = useStudioConfig();
    const { t } = useTranslation();

    useEffect(() => {
        return monitorForElements({
            onDrop({ location, source }) {
                console.log('source', source);
                const target = location.current.dropTargets[0];
                console.log('target', target);
                if (!target) return;

                const { entity: targetEntity, type, key, as } = target.data;

                console.log('target entity', targetEntity, type);
                if (!(targetEntity instanceof Entity) || typeof type !== 'string') 
                    return;

                const { entity: sourceEntity } = source.data;

                console.log('source entity', sourceEntity);
                if (!(sourceEntity instanceof Entity))
                    return;

                if (type === 'current') {
                    sourceEntity.parent = targetEntity;
                } else if (type === 'up') {
                    targetEntity.parent?.after(sourceEntity, targetEntity);
                } else if (type === 'assign' && sourceEntity instanceof as) {
                    targetEntity[key] = sourceEntity;                 
                }
            },
        })
    }, []);

    if (!project) {
        return (
            <PageContainer>
                <Alert color="danger">
                    {t('Active project doesn\'t exist. Can\'t open studio')}
                </Alert>         
            </PageContainer>

        )
    }

    return (
        <>
            <TopBar />
            { project && <Layout config={config} /> }
        </>
    )
});