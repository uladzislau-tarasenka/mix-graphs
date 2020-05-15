import { InputGraph, PositionedGraph, PositionedNode, Edge, GenericGraph, Group, GenericObject } from "../types";

export abstract class Library {
    protected initialGraph: PositionedGraph;
    protected container: HTMLElement;
    protected internalGraph: GenericGraph;

    constructor (container: HTMLElement) {
        this.container = container;
        this.initialGraph = {
            type: '',
            groups: [],
            nodes: [],
            edges: [],
        };
        this.internalGraph = {
            nodes: [],
            edges: [],
        };
    }

    protected transformToLibraryStructure (graph: PositionedGraph | InputGraph): GenericGraph {
        const { edges, nodes } = graph;

        return {
            // @ts-ignore
            nodes: this.getTransformedToLibraryNodes(nodes),
            edges: this.getTransformedToLibraryEdges(edges),
        }
    }

    protected abstract getTransformedToLibraryNodes (nodes: (Node| PositionedNode)[]): GenericObject[];

    protected abstract getTransformedToLibraryEdges (edges: Edge[]): GenericObject[];

    protected transformToMainType (data: GenericGraph): PositionedGraph {
        const { edges, nodes } = data;
        const { type, groups } = this.initialGraph;

        return {
            type,
            groups,
            nodes: this.getTransformedToMainTypeNodes(nodes),
            edges: this.getTransformedToMainTypeEdges(edges),
        }
    }

    protected abstract getTransformedToMainTypeNodes (nodes: GenericObject[]): PositionedNode[];

    protected abstract getTransformedToMainTypeEdges (edges: GenericObject[]): Edge[];

    setBaseGraph (graph: PositionedGraph | null): void {
        if (graph !== null) {
            const { nodes, edges } = this.transformToLibraryStructure(graph);

            this.initialGraph.groups = graph.groups as Group[];

            this.internalGraph.nodes = nodes;
            this.internalGraph.edges = edges;
        }
    }

    addSubgraph (subGraph: InputGraph): void {
        const { nodes, edges } = this.transformToLibraryStructure(subGraph);

        this.initialGraph.type = subGraph.type;
        this.initialGraph.groups = this.initialGraph.groups?.concat(subGraph.groups || []);

        this.internalGraph.nodes = this.internalGraph.nodes.concat(nodes);
        this.internalGraph.edges = this.internalGraph.edges.concat(edges);
    }

    abstract visualize(unlock?: boolean): Promise<PositionedGraph>
}