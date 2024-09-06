import { telescope } from "@/studio/stores";
import { ConverterProps } from "@/studio/stores/converter";
import { Box, Typography } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const PrimitiveConverter: FC<ConverterProps<
    string | number | boolean,
    String | Number | Boolean
>> = observer(({ store }) => {
    const onClick = async () => {
        const response = await telescope.request({
            defaultValue: store.value.toString(),
            require: false,
            validator: store.as,
        });

        if (response.type === 'closed') return;
        store.set(JSON.parse(response.value));
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography onClick={onClick}>{store.value.toString()}</Typography>
        </Box>
    );
});