import { Library } from 'Library';
import { PositionedGraph, InputGraph, Edge, Node, PositionedNode } from './types';
declare class CytoscapeLibrary extends Library {
    private instance;
    private options;
    constructor(container: HTMLElement, options: any);
    protected transformToLibraryStructure(graph: PositionedGraph | InputGraph): {
        nodes: {
            data: {
                id: number;
                label: string;
            };
        }[];
        edges: {
            data: {
                source: number;
                target: number;
                isBidirected?: boolean | undefined;
            };
        }[];
    };
    protected getTransformedToLibraryNodes(nodes: (Node | PositionedNode)[]): {
        data: {
            group?: number | undefined;
            id: number;
            label: string;
            type: string;
        } | {
            group?: number | undefined;
            id: number;
            label: string;
            type: string;
            x: number;
            y: number;
        };
    }[];
    private getTransformedToLibrarGroups;
    protected getTransformedToLibraryEdges(edges: Edge[]): {
        data: {
            source: number;
            target: number;
            isBidirected?: boolean | undefined;
        };
    }[];
    protected getTransformedToMainTypeNodes(nodes: any): PositionedNode[];
    protected getTransformedToMainTypeEdges(edges: any): Edge[];
    visualize(unlock?: boolean): Promise<PositionedGraph>;
}
export { CytoscapeLibrary };
