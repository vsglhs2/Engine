import { Telescope as TelescopeNS, telescope } from "@/studio/stores";
import { Autocomplete, AutocompleteChangeReason, Modal } from "@mui/joy";
import { observer } from "mobx-react-lite";
import { FC, FocusEvent, useCallback, useState } from "react";
import './Telescope.Module.scss';
import { useMousePosition } from "@/studio/hooks";

const defaultOptions: Required<TelescopeNS.Options> = {
    options: [],
    multiple: false,
    require: false,
    defaultValue: '',
};

type OnChange = (
    event: React.SyntheticEvent,
    value: string | string[] | null,
    reason: AutocompleteChangeReason,
) => void;

// TODO: разобраться, по какой причине autoSelect не срабатывает и приходится использовать onFocus

export const Telescope: FC = observer(() => {
    const [value, setValue] = useState<string | string[] | null>(null);

    const { head } = telescope;
    const open = Boolean(head);
    const {
        options,
        multiple,
        require,
        defaultValue,
    } = head ?? defaultOptions;

    const position = useMousePosition([head]);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') return telescope.resolve({
            type: 'closed',
        });
    }, []);

    const onChange: OnChange = useCallback((e, value) => {
        setValue(value);
        
        let resolved: TelescopeNS.Resolved | undefined = undefined;

        if (value instanceof Array && multiple) {
            resolved = { type: 'options', options: value };
        } else if (value instanceof Array) {
            resolved = { type: 'values', values: value };
        } else if (typeof value === 'string' && require) {
            resolved = { type: 'option', option: value };
        } else if (typeof value === 'string' && require) {
            resolved = { type: 'option', option: value };
        } else if (typeof value === 'string') {
            resolved = { type: 'value', value };
        }

        if (!resolved) return;
        telescope.resolve(resolved);
        setValue(null);
    }, [head]);

    const onBlur = useCallback(() => telescope.resolve({
        type: 'closed',
    }), []);

    const onFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
        setTimeout(() => e.target.select());
    }, []);

    return (
        <Modal
            style={{
                // TODO: подобрать наиболее подходящий отступ
                top: position.clientY - 18,
                left: position.clientX - 14
                ,
                zIndex: 2000,
            }}
            slotProps={{
                backdrop: { style: { background: 'transparent', backdropFilter: 'none' } }
            }}
            open={open}
            className="telescope-modal"
            disableRestoreFocus
        >
            <Autocomplete
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onFocus={onFocus}
                autoFocus
                openOnFocus
                clearOnBlur
                clearOnEscape
                disableCloseOnSelect
                autoHighlight
                className="telescope-input"
                options={options}
                freeSolo={!require}
                multiple={multiple}
                value={value ?? defaultValue}
            />
        </Modal>
    );
});