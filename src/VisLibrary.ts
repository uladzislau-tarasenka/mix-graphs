import { Network } from 'vis-network';

import { Library } from 'Library';
import { Edge, GenericObject, PositionedNode } from './types';

class VisLibrary extends Library {
    private instance: Network;
    private options: GenericObject;

    constructor (container: HTMLElement, options) {
        super(container);
        const { type, ...fa2Settings } = options;
        this.options = {
            edges: {
                smooth: false,
            },
            physics: {
                forceAtlas2Based: {...fa2Settings},
                solver: 'forceAtlas2Based',
            }
        };
    }

    protected getTransformedToLibraryNodes (nodes: (Node| PositionedNode)[]) {
        return nodes.map(node => {
            const nodeCopy = {...node } as Node| PositionedNode;

            // @ts-ignore
            if (nodeCopy.x && nodeCopy.y) {
                // @ts-ignore
                nodeCopy.fixed = true;
            }

            return nodeCopy;
        });
    }

    protected getTransformedToLibraryEdges (edges: Edge[]) {
        return edges.map(edge => {
            const edgeCopy = {...edge };

            // @ts-ignore
            edgeCopy.from = edgeCopy.source;
            // @ts-ignore
            edgeCopy.to = edgeCopy.target;
            // @ts-ignore
            edgeCopy.arrows = edgeCopy.isBidirected ? undefined : 'to';

            delete edgeCopy.source;
            delete edgeCopy.target;

            return edgeCopy;
        });
    }

    protected getTransformedToMainTypeNodes (nodes): PositionedNode[] {
        return nodes.map(node => {
            const nodeCopy = { ...node };

            delete nodeCopy.fixed;

            return nodeCopy;
        });
    }

    protected getTransformedToMainTypeEdges (edges): Edge[] {
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