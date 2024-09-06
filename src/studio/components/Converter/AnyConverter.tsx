import { ConverterProps } from "@/studio/stores/converter";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const AnyConverter: FC<ConverterProps<unknown>> = observer(() => {
    const { t } = useTranslation();

    return (
        <div>
            {t('Cannot convert value')}
        </div>
    );
});