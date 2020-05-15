import { InputGraph, PositionedGraph, PositionedNode, Edge, GenericGraph, GenericObject } from "../types";
export declare abstract class Library {
    protected initialGraph: PositionedGraph;
    protected container: HTMLElement;
    protected internalGraph: GenericGraph;
    constructor(container: HTMLElement);
    protected transformToLibraryStructure(graph: PositionedGraph | InputGraph): GenericGraph;
    protected abstract getTransformedToLibraryNodes(nodes: (Node | PositionedNode)[]): GenericObject[];
    protected abstract getTransformedToLibraryEdges(edges: Edge[]): GenericObject[];
    protected transformToMainType(data: GenericGraph): PositionedGraph;
    protected abstract getTransformedToMainTypeNodes(nodes: GenericObject[]): PositionedNode[];
    protected abstract getTransformedToMainTypeEdges(edges: GenericObject[]): Edge[];
    setBaseGraph(graph: PositionedGraph | null): void;
    addSubgraph(subGraph: InputGraph): void;
    abstract visualize(unlock?: boolean): Promise<PositionedGraph>;
}
