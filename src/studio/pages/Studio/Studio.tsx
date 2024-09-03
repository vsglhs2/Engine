import { FC } from "react";
import { Layout, TopBar } from "../../components";
import './Studio.Module.scss';
import { observer } from "mobx-react-lite";
import { projects } from "../../stores";
import { useStudioConfig } from "./use-studio-config";
import { Alert, PageContainer } from "@/studio/ui";
import { useTranslation } from "react-i18next";

export const Studio: FC = observer(() => {
    const project = projects.active;
    const config = useStudioConfig();
    const { t } = useTranslation();

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