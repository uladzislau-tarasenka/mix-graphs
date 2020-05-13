import { InputGraph, PositionedGraph, PositionedNode, Edge, GenericObject } from "./types";
export declare abstract class Library {
    protected initialGraph: PositionedGraph | InputGraph;
    protected container: HTMLElement;
    protected internalData: {
        nodes: GenericObject[];
        edges: GenericObject[];
    };
    constructor(container: HTMLElement);
    protected transformToLibraryStructure(graph: PositionedGraph | InputGraph): {
        nodes: any;
        edges: void;
    };
    protected abstract getTransformedToLibraryNodes(nodes: (Node | PositionedNode)[]): void;
    protected abstract getTransformedToLibraryEdges(edges: Edge[]): void;
    protected transformToMainType(data: any): PositionedGraph;
    protected abstract getTransformedToMainTypeNodes(nodes: any): PositionedNode[];
    protected abstract getTransformedToMainTypeEdges(edges: any): Edge[];
    setBaseGraph(graph: PositionedGraph | null): void;
    addSubgraph(subGraph: InputGraph): void;
    abstract visualize(unlock?: boolean): Promise<PositionedGraph>;
}
