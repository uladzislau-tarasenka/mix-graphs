import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';

import { Library } from '@src/Library/Library';
import {
    CytoscapeLayoutDescription,
    Edge,
    GenericObject,
    Group,
    InputGraph,
    Node,
    PositionedGraph,
    PositionedNode,
} from '../types';

cytoscape.use(avsdf);
cytoscape.use(fcose);
cytoscape.use(dagre);

const STYLE = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'bottom',
            'color': '#000000',
            'background-color': '#3a7ecf',
            'font-size': '10px',
        }
    }, {
        selector: ':parent',
        style: {
            'background-opacity': 0.333,
            'border-color': '#2B65EC',
            'text-valign': 'top',
        }
    }, {
        selector: 'edge',
        style: {
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
    },
];

class CytoscapeLibrary extends Library {
    private instance: cytoscape;
    private options: GenericObject;

    constructor(container: HTMLElement, options: CytoscapeLayoutDescription) {
        super(container);
        this.options = options;
    }
    // @ts-ignore
    protected transformToLibraryStructure(graph: PositionedGraph | InputGraph) {
        const { edges, nodes, groups } = graph;

        return {
            nodes: [...this.getTransformedToLibraryNodes(nodes), ...this.getTransformedToLibrarGroups(groups as Group[])],
            edges: this.getTransformedToLibraryEdges(edges),
        }
    }
    // @ts-ignore
    protected getTransformedToLibraryNodes(nodes: (Node | PositionedNode)[]) {
        return nodes.map(node => {
            const nodeCopy = { data: { ...node } };
            // @ts-ignore
            if (nodeCopy.data.x && nodeCopy.data.y) {
                // @ts-ignore
                nodeCopy.locked = true;
                // @ts-ignore
                nodeCopy.renderedPosition = {
                    // @ts-ignore
                    x: nodeCopy.data.x,
                    // @ts-ignore
                    y: nodeCopy.data.y,
                };
                // @ts-ignore
                delete nodeCopy.data.x;
                // @ts-ignore
                delete nodeCopy.data.y;
            }

            if (nodeCopy.data.group) {
                // @ts-ignore
                nodeCopy.data.parent = String(nodeCopy.data.group);
                delete nodeCopy.data.group;
            }

            return nodeCopy;
        });
    }

    private getTransformedToLibrarGroups(groups: Group[]) {
        return groups.map(group => {
            const groupCopy = { ...group };

            return { data: groupCopy };
        });
    }

    protected getTransformedToLibraryEdges(edges: Edge[]) {
        return edges.map(edge => {
            const edgeCopy = { ...edge };
            // @ts-ignore
            edgeCopy.directed = String(!edgeCopy.isBidirected);
            delete edgeCopy.isBidirected;

            return { data: edgeCopy };
        });
    }

    protected getTransformedToMainTypeNodes(nodes): PositionedNode[] {
        const groupsIds: number[] = [];
        const transformedNodes = nodes.map(node => {
            const nodeCopy = { ...node.data };

            nodeCopy.id = Number(nodeCopy.id);

            if (nodeCopy.parent) {
                nodeCopy.group = Number(nodeCopy.parent);
                groupsIds.push(nodeCopy.group);
            }

            delete nodeCopy.parent;

            return nodeCopy;
        });

        return transformedNodes.filter(node => !groupsIds.includes(node.id));
    }

    protected getTransformedToMainTypeEdges(edges): Edge[] {
        return edges.map(edge => {
            const edgeCopy = { ...edge.data };

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

    async visualize(unlock = false) {
        const { type, ...rest } = this.options;
        this.instance = cytoscape({ container: this.container, elements: this.internalGraph, layout: { name: type, ...rest }, style: STYLE });

        await new Promise((resolve, reject) => {
            const onStabilized = () => {
                this.internalGraph.nodes = this.internalGraph.nodes.map(node => ({ data: { ...node.data, ...this.instance.$(`node[id="${node.data.id}"]`).position() } }));
                resolve();
            }
            this.instance.ready(onStabilized);
        });

        if (unlock) {
            setTimeout(() => { this.instance.nodes().unlock() }, 2000);
        }

        return this.transformToMainType(this.internalGraph);
    }
}

export { CytoscapeLibrary };