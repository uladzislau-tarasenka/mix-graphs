import { InputGraph, PositionedGraph, PositionedNode, Edge, GenericObject, Group } from "./types";

export abstract class Library {
    protected initialGraph: PositionedGraph | InputGraph;
    protected container: HTMLElement;
    protected internalData: {
        nodes: GenericObject[],
        edges: GenericObject[],
    };

    constructor (container: HTMLElement) {
        this.container = container;
        this.initialGraph = {
            type: '',
            groups: [],
            nodes: [],
            edges: [],
        };
        this.internalData = {
            nodes: [],
            edges: [],
        };
    }

    protected transformToLibraryStructure (graph: PositionedGraph | InputGraph) {
        const { edges, nodes } = graph;

        return {
            // @ts-ignore
            nodes: this.getTransformedToLibraryNodes(nodes),
            edges: this.getTransformedToLibraryEdges(edges),
        }
    }

    protected abstract getTransformedToLibraryNodes (nodes: (Node| PositionedNode)[]): void;

    protected abstract getTransformedToLibraryEdges (edges: Edge[]): void;

    protected transformToMainType (data): PositionedGraph {
        const { edges, nodes } = data;
        const { type, groups } = this.initialGraph;

        return {
            type,
            groups,
            nodes: this.getTransformedToMainTypeNodes(nodes),
            edges: this.getTransformedToMainTypeEdges(edges),
        }
    }

    protected abstract getTransformedToMainTypeNodes (nodes): PositionedNode[];

    protected abstract getTransformedToMainTypeEdges (edges): Edge[];

    setBaseGraph (graph: PositionedGraph | null) {
        if (graph !== null) {
            const { nodes, edges } = this.transformToLibraryStructure(graph);

            this.initialGraph.groups = graph.groups as Group[];

            this.internalData.nodes = nodes;
            // @ts-ignore
            this.internalData.edges = edges;
        }
    }

    addSubgraph (subGraph: InputGraph) {
        const { nodes, edges } = this.transformToLibraryStructure(subGraph);

        this.initialGraph.type = subGraph.type;
        this.initialGraph.groups = this.initialGraph.groups?.concat(subGraph.groups || []);

        this.internalData.nodes = this.internalData.nodes.concat(nodes);
        // @ts-ignore
        this.internalData.edges = this.internalData.edges.concat(edges);
    }

    abstract visualize(unlock?: boolean): Promise<PositionedGraph>
}