
import List from '@mui/joy/List';
import { FC } from 'react';
import { TopBar as TopBarType } from '@/studio/stores';
import { observer } from 'mobx-react-lite';
import { TopBarElement } from './TopBarElement';

type TopBarProps = {
    config: TopBarType.Config;
};

export const TopBar: FC<TopBarProps> = observer(({ config }) => {
    const renderedElements = config.elements.map((item, i)  => (
        <TopBarElement key={item.id} element={item} navigationIndex={i} />
    ));

    return (
        <List
            orientation="horizontal"
            role="menubar"
            sx={{
                bgcolor: 'background.body',
                borderRadius: '4px',
                maxWidth: 'fit-content',
            }}
        >
            {renderedElements}
        </List>
    );
});
