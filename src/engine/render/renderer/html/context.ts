export default class HTMLRenderingContext {
    constructor(private root: HTMLDivElement) {}

    render(toRender: HTMLElement) {
        this.root.append(toRender);
        this.root.style.userSelect = 'none';
    }

    clear() {
        this.root.innerHTML = '';
    }
}
