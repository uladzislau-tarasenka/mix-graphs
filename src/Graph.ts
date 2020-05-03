import {
    Edge,
    GraphSubsetDescription,
    InputGraph,
    InternalGraph,
    LayoutDescription,
    Node,
    Rule,
} from './types';

import { ExportTypes, Layouts } from './constants';
import { FileSaver } from './FileSaver';
import { Library } from './Library';
import { CytoscapeLibrary } from './CytoscapeLibrary';
import { VisLibrary } from './VisLibrary';

export interface IConfig {
    get(graphSubsetDescription: GraphSubsetDescription): void,
    useLayout(layoutDescription: LayoutDescription): void,
    useFor(graphStructure: InputGraph): void,
    export(exportName: string, exportType?: ExportTypes): void,
    build(): void,
}

class Config implements IConfig {
    private container: HTMLElement;
    private graph: InternalGraph | null;
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

    private getNeededLibrary(layout): Library |  Error {
        const { type, ...rest } = layout;

        switch (type) {
            case Layouts.Fa2: {
                return new VisLibrary(this.container, rest);
            }
            case Layouts.Avsdf:
            case Layouts.Cose:
            case Layouts.Dagre: {
                return new CytoscapeLibrary(this.container, rest);
            }

            default: {
                return new Error("Choosed library isn't implemented");
            }
        }
    }

    private checkRule(rule: Rule): void {
        console.log(rule);
    }

    private getSubGraph(subset: GraphSubsetDescription): InputGraph {
        const { type, nodes, edges, groups } = this.inputGraph as InputGraph;
        const filteredNodes = this.getFilteredNodes(nodes, subset);
        const filteredEdges = this.getFilteredEdges(edges, filteredNodes);

        return {
            type,
            groups,
            nodes: filteredNodes,
            edges: filteredEdges,
        };
    }

    private getFilteredNodes (nodes: Node[], subset: GraphSubsetDescription): Node[] {
        return nodes.filter(node => {
            return Object.entries(subset).every(([key, value]) => node[key] === value)
        });
    }

    private getFilteredEdges (edges: Edge[], nodes: Node[]): Edge[] {
        const nodesIds = nodes.map(node => node.id);

        return edges.filter(({ source, target }) => {
            debugger;
            let hasSource = false;
            let hasTarget = false;

            for (const id of nodesIds) {
                if (source === id) {
                    hasSource = true;
                }

                if (target === id) {
                    hasTarget = true;
                }

                if (hasSource && hasTarget) {
                    return true;
                }
            }

            return false;
        });
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

    async build(): Promise<void> {
        for (const { subset, layout } of this.rules) {
            const subGraph = this.getSubGraph(subset as GraphSubsetDescription);
            const library = this.getNeededLibrary(layout);

            this.checkRule({ subset, layout });

            if (!(library instanceof Error)) {
                library.setBaseGraph(this.graph);
                library.addSubgraph(subGraph);
                this.graph = await library.visualize();
            }
        }
    }
}

export { Config };