import { explorer, globalSerializer } from "@/studio/stores";
import { converterComponents, converterValues } from "@/studio/stores/converter";
import { Alert, PageContainer } from "@/studio/ui";
import { Box, Typography } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Explorer: FC = observer(() => {
    const { t } = useTranslation();
    const [entity] = explorer.state;

    if (!entity) {
        return (
            <PageContainer>
                <Alert color="neutral">
                    {t('No entity was selected')}
                </Alert>
            </PageContainer>
        )
    }

    const name = globalSerializer.getEntityName(entity);
    const renderedHead = (
        <Typography>
            {name}
        </Typography>
    );

    const serializerState = globalSerializer.getSerializableState(entity);
    const renderedState = serializerState ? Object
        .entries(serializerState)
        .map(([key, Constructor]) => {
            let value = converterValues.getValue(entity, key);
            if (!value) value = converterValues.createValueForKey(entity, key, Constructor);

            const Component = converterComponents.getConvertibleValueComponent(Constructor);

            return (
                <Box display={'flex'} gap={2} key={key}>
                    <Typography>{key}</Typography>
                    <Component store={value} />
                </Box>
            )
        }) : (
        <Alert>{t('No serializable state found')}</Alert>
    );

    return (
        <PageContainer>
            {renderedHead}
            {renderedState}
        </PageContainer>
    );
});