import { autorun, makeAutoObservable, reaction, runInAction, when } from "mobx";
import { createRef, KeyboardEvent, MutableRefObject } from "react";

export namespace TopBar {
    export enum ElementType {
        'Item',
        'Menu',
        'Divider',
    };

    export type Item = {
        id: string;
        title: string;
        type: ElementType.Item;
    };

    export type Divider = {
        id: string;
        type: ElementType.Divider;
    };

    export type Menu = {
        id: string;
        title: string;
        items: Element[];
        type: ElementType.Menu;
    };

    export type Element = Menu | Item | Divider;

    export type Config = {
        elements: Element[];
    };

    export function menu(id: string, title: string, items: Element[] = []): Menu {
        return {
            id,
            title,
            items,
            type: ElementType.Menu,
        };
    }

    export function item(id: string, title: string): Item {
        return {
            id,
            title,
            type: ElementType.Item,
        };
    }

    export function divider(id: string): Divider {
        return {
            id,
            type: ElementType.Divider,
        };
    }

    export class Store {
        public menus: MutableRefObject<HTMLButtonElement[]>;
        public menuIndex: number | null;
        public triggeredIds: string[];

        constructor() {
            this.menus = createRef() as MutableRefObject<HTMLButtonElement[]>;
            this.menus.current = [];
            this.menuIndex = null;
            this.triggeredIds = [];

            makeAutoObservable(this, {}, { autoBind: true });
        }

        dispatch(id: string) {
            this.triggeredIds.push(id);
        }

        subscribe(id: string, callback: () => void) {
            console.log('sub: ', id);
            const unsubscribe = reaction(() => this.triggeredIds.includes(id), (includes) => {
                if (!includes) return;
                
                runInAction(() => {
                    callback();

                    const index = this.triggeredIds.findIndex(i => i === id);                    
                    this.triggeredIds.splice(index, 1);
                });
            });

            return () => {
                unsubscribe();
                console.log('cancel: ', id);
            };
        }

        openNextMenu() {
            if (typeof this.menuIndex !== 'number') return;

            if (this.menuIndex === this.menus.current.length - 1) {
                this.menuIndex = 0;
                return;
            }

            this.menuIndex++;
        };

        openPreviousMenu() {
            if (typeof this.menuIndex !== 'number') return;

            if (this.menuIndex === 0) {
                this.menuIndex = this.menus.current.length - 1;
                return;
            }

            this.menuIndex--;
            
        };

        handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'ArrowRight') {
                this.openNextMenu();
            }

            if (event.key === 'ArrowLeft') {
                this.openPreviousMenu();
            }
        };

        createHandleButtonKeyDown(index: number) {
            return (event: KeyboardEvent) => {
                if (event.key === 'ArrowRight') {
                    if (index === this.menus.current.length - 1) {
                        this.menus.current[0]?.focus();
                    } else {
                        this.menus.current[index + 1]?.focus();
                    }
                }
                if (event.key === 'ArrowLeft') {
                    if (index === 0) {
                        this.menus.current[this.menus.current.length]?.focus();
                    } else {
                        this.menus.current[index - 1]?.focus();
                    }
                }
            };
        }


    }
}

export const topbar = new TopBar.Store();