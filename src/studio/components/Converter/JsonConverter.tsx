import { Json } from "@/engine/decorators";
import { telescope } from "@/studio/stores";
import { ConverterProps } from "@/studio/stores/converter";
import { Box } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const JsonConverter: FC<ConverterProps<Json>> = observer(({ store }) => {
    const keys = Object.keys(store.value);

    const onClick = (key: string | symbol) => async () => {
        const targetValue = store.value[key];
        if (targetValue instanceof Object) return;

        const response = await telescope.request({
            defaultValue: JSON.stringify(targetValue),
            require: false,
        });

        if (response.type === 'closed') return;
        const { value } = response;

        store.change(key, JSON.parse(value));
    };

    const renderedFields = keys.map(key => {
        const targetValue = store.value[key];
        const converted =String(targetValue instanceof Object
            ? 'Unknown'
            : targetValue);

        return (
            <Box display="flex" gap={2} key={key.toString()}>
                {key.toString()}: <span onClick={onClick(key)}>{converted}</span>
            </Box>            
        );
    });

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {renderedFields}
        </Box>
    );
});