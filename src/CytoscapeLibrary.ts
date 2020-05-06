import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';

import { Library } from 'Library';
import { InternalGraph, InputGraph, Edge, GenericObject, Node, InternalNode } from './types';

cytoscape.use( avsdf );
cytoscape.use( fcose );
cytoscape.use( dagre );

const STYLE = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'color': '#000000',
            'background-color': '#3a7ecf'
        }
    }, {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#3a7ecf',
            'opacity': 0.5,
            'target-arrow-color': '#3a7ecf',
            'target-arrow-shape': 'triangle',
        }
    }, {
        selector: 'edge[directed="true"]',
        style: {
            'curve-style': 'bezier',
        }
    }
];

class CytoscapeLibrary implements Library {
    private instance: cytoscape;
    private container: HTMLElement;
    private options: GenericObject; 
    private initialGraph: InternalGraph | InputGraph;
    private internalData: {
        nodes: GenericObject[],
        edges: GenericObject[],
    };

    constructor (container: HTMLElement, graph, options) {
        this.container = container;
        this.options = options;
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
                nodeCopy.locked = true;
            }

            return { data: nodeCopy };
        });
    }

    private getTransformedToLibraryEdges (edges: Edge[]) {
        return edges.map(edge => {
            const edgeCopy = {...edge };

            edgeCopy.directed = String(!edgeCopy.isBidirected);
            delete edgeCopy.isBidirected;

            return { data: edgeCopy };
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
            const nodeCopy = {...node.data };

            nodeCopy.id = Number(nodeCopy.id);

            delete nodeCopy.locked;

            return nodeCopy;
        });
    }

    private getTransformedToMainTypeEdges (edges): Edge[] {
        return edges.map(edge => {
            const edgeCopy = {...edge.data };

            edgeCopy.source = Number(edgeCopy.source);
            edgeCopy.target = Number(edgeCopy.target);
            edgeCopy.isBidirected = edgeCopy.directed === 'true';

            if (!edgeCopy.isBidirected) {
                delete edgeCopy.isBidirected;
            }

            delete edgeCopy.id;
            delete edgeCopy.directed;

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
        this.instance = cytoscape({ container: this.container, elements: this.internalData, layout: { name: this.options.type }, style: STYLE });

        await new Promise((resolve, reject) => {
            const onStabilized = () => {
                this.internalData.nodes = this.internalData.nodes.map(node => ({ data: {...node.data, ...this.instance.$(`node[id="${node.data.id}"]`).position()} }));
                resolve();
            }
            this.instance.ready(onStabilized);
          });

        return this.transformToMainType(this.internalData);
    }
}

export { CytoscapeLibrary };