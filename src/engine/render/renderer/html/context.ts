export default class HTMLRenderingContext {
    constructor(private root: HTMLDivElement) {}

    render(toRender: HTMLElement) {
        this.root.append(toRender);
    }

    clear() {
        this.root.innerHTML = '';
    }
}
