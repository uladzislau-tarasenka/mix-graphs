import { GraphSubsetDescription, Node, MarkedNode, PositionedNode, Edge, GenericObject, Dictionary } from "../types";

export class GraphHelper {
    static isFitSubset (node: Node | MarkedNode | PositionedNode, subset: GraphSubsetDescription): boolean {
        return Object.entries(subset).every(([key, value]) => {
            if (Array.isArray(value)) {
                return value.includes(node[key]);
            }
    
            return node[key] === value;
        });
    }

    static getSubsetIds (nodes: (Node | MarkedNode | PositionedNode)[], subset: GraphSubsetDescription): number[] {
        const ids: number[] = [];
    
        for (const node of nodes) {
            if (GraphHelper.isFitSubset(node, subset)) {
                ids.push(node.id);
            }
        }
    
        return ids;
    }

    static detectCycle (edges: Edge[]): boolean {
        const connectedNodesList = GraphHelper.getConnectedNodesList(edges);
        const graphNodes = Object.keys(connectedNodesList);
        const visited = {};
        const recStack = {};
    
        for (let i = 0; i < graphNodes.length; i++) {
            const node = graphNodes[i];
    
            if (GraphHelper.detectCycleUtil(connectedNodesList, node, visited, recStack)) {
                return true;
            }
        }
    
        return false;
    };

    private static getConnectedNodesList (edges: Edge[]): Dictionary<number[]> {
        const connectedNodesList = {};
    
        for (const { source, target } of edges) {
            if (!connectedNodesList[source]) {
                connectedNodesList[source] = [];
            }
    
            if (!connectedNodesList[target]) {
                connectedNodesList[target] = [];
            }
    
            connectedNodesList[source].push(target);
        }
    
        return connectedNodesList;
    }

    private static detectCycleUtil (vertexList, vertex, visited, recStack) {
        if (!visited[vertex]) {
            visited[vertex] = true;
            recStack[vertex] = true;
            const nodeNeighbors = vertexList[vertex];
            for (let i = 0; i < nodeNeighbors.length; i++) {
                const currentNode = nodeNeighbors[i];
                if (!visited[currentNode] && GraphHelper.detectCycleUtil(vertexList, currentNode, visited, recStack)) {
                    return true;
                } else if (recStack[currentNode]) {
                    return true;
                }
            }
        }
        recStack[vertex] = false;
    
        return false;
    }
}
