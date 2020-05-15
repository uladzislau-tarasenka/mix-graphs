import { GraphSubsetDescription, Node, MarkedNode, PositionedNode, Edge } from "../types";
export declare class GraphHelper {
    static isFitSubset(node: Node | MarkedNode | PositionedNode, subset: GraphSubsetDescription): boolean;
    static getSubsetIds(nodes: (Node | MarkedNode | PositionedNode)[], subset: GraphSubsetDescription): number[];
    static detectCycle(edges: Edge[]): boolean;
    private static getConnectedNodesList;
    private static detectCycleUtil;
}
