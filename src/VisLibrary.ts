import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

import { Library } from 'Library';
import { InternalGraph, InputGraph, Edge, GenericObject, InternalNode } from './types';

class VisLibrary implements Library {
    private instance: Network;
    private container: HTMLElement;
    private options: GenericObject;
    private initialGraph: InternalGraph | InputGraph;
    private internalData: {
        nodes: GenericObject[],
        edges: GenericObject[],
    };

    constructor (container: HTMLElement, graph, options) {
        this.container = container;
        this.options = {
            edges: {
                smooth: false,
            },
            physics: {
                forceAtlas2Based: {...options},
                solver: 'forceAtlas2Based',
            }
        };

        this.initialGraph = graph;

        this.internalData = {
            nodes: [],
            edges: [],
        };
    }

    private transformToLibraryStructure (graph: InternalGraph | InputGraph) {
        const { edges, nodes } = graph;

        return {
            nodes: this.getTransformedToLibraryNodes(nodes),
            edges: this.getTransformedToLibraryEdges(edges),
        }
    }

    private getTransformedToLibraryNodes (nodes: (Node| InternalNode)[]) {
        return nodes.map(node => {
            const nodeCopy = {...node };

            if (nodeCopy.x && nodeCopy.y) {
                nodeCopy.fixed = true;
            }

            return nodeCopy;
        });
    }

    private getTransformedToLibraryEdges (edges: Edge[]) {
        return edges.map(edge => {
            const edgeCopy = {...edge };

            edgeCopy.from = edgeCopy.source;
            edgeCopy.to = edgeCopy.target;
            edgeCopy.arrows = edgeCopy.isBidirected ? undefined : 'to';

            delete edgeCopy.source;
            delete edgeCopy.target;

            return edgeCopy;
        });
    }

    private transformToMainType (data): InternalGraph {
        const { edges, nodes } = data;
        const { type, groups } = this.initialGraph;

        return {
            type,
            groups,
            nodes: this.getTransformedToMainTypeNodes(nodes),
            edges: this.getTransformedToMainTypeEdges(edges),
        }
    }

    private getTransformedToMainTypeNodes (nodes): InternalNode[] {
        return nodes.map(node => {
            const nodeCopy = { ...node };

            delete nodeCopy.fixed;

            return nodeCopy;
        });
    }

    private getTransformedToMainTypeEdges (edges): Edge[] {
        return edges.map(edge => {
            const edgeCopy = {...edge };

            edgeCopy.source = edgeCopy.from;
            edgeCopy.target = edgeCopy.to;

            delete edgeCopy.from;
            delete edgeCopy.to;
            delete edgeCopy.id;
            delete edgeCopy.arrows;

            return edgeCopy;
        });
    }

    setBaseGraph (graph: InternalGraph | null) {
        if (graph !== null) {
            const { nodes, edges } = this.transformToLibraryStructure(graph);

            this.internalData.nodes = nodes;
            this.internalData.edges = edges;
        }
    }

    addSubgraph (subGraph: InputGraph) {
        const { nodes, edges } = this.transformToLibraryStructure(subGraph);

        this.internalData.nodes = this.internalData.nodes.concat(nodes);
        this.internalData.edges = this.internalData.edges.concat(edges);
    }

    async visualize () {
        this.instance = new Network(this.container, this.internalData, this.options);

        await new Promise((resolve, reject) => {
            const onStabilized = () => {
                const positions = this.instance.getPositions();
                this.internalData.nodes = this.internalData.nodes.map(node => ({ ...node, ...positions[node.id] }));
                resolve();
            }
            this.instance.on('stabilized', onStabilized);
          });

        return this.transformToMainType(this.internalData);
    }
}

export { VisLibrary };