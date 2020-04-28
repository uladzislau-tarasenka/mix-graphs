import { InputGraph, GraphSubsetDescription, LayoutDescription, Rule } from './types';
import { ExportTypes } from './constants';
import { FileSaver } from './FileSaver';

interface IConfig {
    get(graphSubsetDescription: GraphSubsetDescription): void,
    useLayout(layoutDescription: LayoutDescription): void,
    useFor(graphStructure: InputGraph): void,
    export(exportName: string, exportType: ExportTypes): void,
    build(): void,
}

class Config implements IConfig {
    private container: HTMLElement;
    private graph: null;
    private inputGraph: InputGraph | null;
    private rules: Rule[];
    private ruleCombiner: Rule;

    constructor(container: HTMLElement) {
        this.container = container;
        this.graph = null;
        this.inputGraph = null;
        this.rules = [];
        this.ruleCombiner = { layout: null, subset: null };
    }

    private resetRuleCombiner(): void {
        this.ruleCombiner = { layout: null, subset: null };
    }

    get(graphSubsetDescription: GraphSubsetDescription): Config {
        this.ruleCombiner.subset = graphSubsetDescription;
        return this;
    }

    useLayout(layoutDescription: LayoutDescription): void {
        this.ruleCombiner.layout = layoutDescription;
        this.rules.push(this.ruleCombiner);
        this.resetRuleCombiner();
    }

    useFor(inputGraph: InputGraph): void {
        this.inputGraph = inputGraph;
    }

    export(exportName: string, exportType?: ExportTypes): void {
        const canvas = this.container.querySelector('canvas');

        if (canvas) {
            FileSaver.saveCanvasAs(canvas, exportName, exportType);
        }
    }

    build(): void {
    }
}

export { Config };