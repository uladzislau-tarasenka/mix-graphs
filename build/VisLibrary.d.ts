import { Library } from 'Library';
import { Edge, PositionedNode } from './types';
declare class VisLibrary extends Library {
    private instance;
    private options;
    constructor(container: HTMLElement, options: any);
    protected getTransformedToLibraryNodes(nodes: (Node | PositionedNode)[]): (Node | PositionedNode)[];
    protected getTransformedToLibraryEdges(edges: Edge[]): {
        source: number;
        target: number;
        isBidirected?: boolean | undefined;
    }[];
    protected getTransformedToMainTypeNodes(nodes: any): PositionedNode[];
    protected getTransformedToMainTypeEdges(edges: any): Edge[];
    visualize(): Promise<import("./types").PositionedGraph>;
}
export { VisLibrary };
