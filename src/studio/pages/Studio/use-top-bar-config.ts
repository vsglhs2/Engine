import { useMemo } from "react";
import { TopBar } from "@/studio/stores";

// TODO: use mobx for handling config??

const { menu, item, divider } = TopBar;

export function useTopBarConfig(): TopBar.Config {
    return useMemo(() => ({
        elements: [
            menu('file', 'File', [
                item('new-file', 'New file'),
                item('new-window', 'New window'),
                divider('divider-1'),
                item('open', 'Open'),
                item('open-folder', 'Open folder'),
            ]),
            menu('edit', 'Edit', [
                item('undo', 'Undo'),
                item('redo', 'Redo'),
                divider('divider-2'),
                item('cut', 'Cut'),
                item('copy', 'Copy'),
                item('paste', 'Paste'),
            ]),
            menu('project', 'Project', [
                item('preview', 'Preview'),
                item('stop', 'Stop'),
                item('build', 'Build'),
                item('export', 'Export'),
                divider('divider-3'),
                item('save', 'Save'),
                item('rename', 'Rename'),
            ]),
        ],
    }), []);
}