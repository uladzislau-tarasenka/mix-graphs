import {
    Edge,
    GraphSubsetDescription,
    InputGraph,
    PositionedGraph,
    LayoutDescription,
    Node,
    Rule,
    MarkedNode,
    Dictionary,
    RuleCheck,
    Group,
} from './types';

import {
    COSE_AVSDF_INTERSECTION_RULE,
    AVSDF_INTERSECTION_RULE,
    DARGE_AVSDF_INTERSECTION_RULE,
    ACYCLE_RULE,
    LayoutSettingsRules,
} from './Rules';

import { GraphHelper } from './GraphHelper';
import { ExportTypes, Layouts } from './constants';
import { FileSaver } from './FileSaver';
import { Library } from './Library';
import { CytoscapeLibrary } from './CytoscapeLibrary';
import { VisLibrary } from './VisLibrary';

export interface IConfig {
    get(graphSubsetDescription: GraphSubsetDescription): void,
    useLayout(layoutDescription: LayoutDescription): void,
    useFor(graphStructure: InputGraph): void,
    export(exportName: string, exportType?: ExportTypes): void,
    build(): void,
}

class Config implements IConfig {
    private container: HTMLElement;
    private graph: PositionedGraph | null;
    private inputGraph: InputGraph | null;
    private markedNodes: Dictionary<MarkedNode>;
    private rules: Rule[];
    private ruleCombiner: Rule;
    private exportConfig: {
        name: string,
        type?: ExportTypes
    } | null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.graph = null;
        this.inputGraph = null;
        this.markedNodes = {};
        this.rules = [];
        this.ruleCombiner = { layout: null, subset: null };
        this.exportConfig = null;
    }

    private resetRuleCombiner(): void {
        this.ruleCombiner = { layout: null, subset: null };
    }

    private setMarkOnNodes ():void {
        for (const node of this.inputGraph?.nodes as Node[]) {
            for (const { subset, layout } of this.rules) {
                if (GraphHelper.isFitSubset(node, subset as GraphSubsetDescription)) {
                    const { id } = node;

                    if (!this.markedNodes[id]) {
                        this.markedNodes[id] = {
                            ...node,
                            markedLayouts: [],
                        };
                    }

                    this.markedNodes[id].markedLayouts.push(layout?.type as Layouts);
                }
            }
        }
    }

    private checkStructureRules (): void {
        for (const id in this.markedNodes) {
            this.checkRule(COSE_AVSDF_INTERSECTION_RULE, { node: this.markedNodes[id] });
        }

        const markedNodes = Object.values(this.markedNodes);

        const avsdfSubsets = this.rules.
            filter(({ layout }) => layout?.type === Layouts.Avsdf)
            .map(({ subset }) => subset);


        this.checkRule(AVSDF_INTERSECTION_RULE, { nodes: markedNodes, avsdfSubsets });

        const dagreSubsets = this.rules.
            filter(({ layout }) => layout?.type === Layouts.Dagre)
            .map(({ subset }) => subset);

        for (const dagreSubset of dagreSubsets) {
            const { edges } = this.inputGraph as InputGraph;
            const filteredNodes = this.getFilteredNodes(markedNodes, dagreSubset as GraphSubsetDescription);
            const filteredEdges = this.getFilteredEdges(edges, filteredNodes);

            this.checkRule(ACYCLE_RULE, { edges: filteredEdges });

            for (const avsdfSubset of avsdfSubsets) {
                this.checkRule(DARGE_AVSDF_INTERSECTION_RULE, { markedNodes, avsdfSubset, dagreSubset });
            }
        }
    }

    private checkLayoutRules(subGraph: InputGraph, layout: LayoutDescription): void {
        const { type, ...settings } = layout;
        const rulesArray = LayoutSettingsRules[type];

        for (const rule of rulesArray) {
            this.checkRule(rule, { settings, subGraph });
        }
    }

    private checkRule({ name, checkFunction }: RuleCheck, params: Dictionary<any>): void {
        const ruleCheckResult = checkFunction(params);

        if (!ruleCheckResult) {
            console.warn(`Rule "${name}" is failed with params \n${JSON.stringify(params)}`);
        }
    }

    private getNeededLibrary(layout): Library |  Error {
        const { type } = layout;

        switch (type) {
            case Layouts.Fa2: {
                return new VisLibrary(this.container, layout);
            }
            case Layouts.Avsdf:
            case Layouts.Cose:
            case Layouts.Dagre: {
                // @ts-ignore
                return new CytoscapeLibrary(this.container, layout);
            }

            default: {
                return new Error("Choosed library isn't implemented");
            }
        }
    }

    private getSubGraph(subset: GraphSubsetDescription, layoutType: Layouts): InputGraph {
        const { type, nodes, edges, groups = [] } = this.inputGraph as InputGraph;
        const filteredNodes = this.getFilteredNodes(nodes, subset);
        const filteredEdges = this.getFilteredEdges(edges, filteredNodes);
        const filteredGroups = layoutType === Layouts.Cose
            ? this.getFilteredGroups(groups, filteredNodes)
            : [];

        return {
            type,
            groups: filteredGroups,
            nodes: filteredNodes,
            edges: filteredEdges,
        };
    }

    private getFilteredNodes (nodes: Node[], subset: GraphSubsetDescription): Node[] {
        return nodes.filter(node => GraphHelper.isFitSubset(node, subset));
    }

    private getFilteredEdges (edges: Edge[], nodes: Node[]): Edge[] {
        const nodesIds = nodes.map(node => node.id);

        return edges.filter(({ source, target }) => {
            const hasSourceInGraph = this.graph?.nodes.find(node => node.id === source);
            const hasTargetInGraph = this.graph?.nodes.find(node => node.id === target);

            let hasSource = false;
            let hasTarget = false;

            for (const id of nodesIds) {
                if (source === id) {
                    if (hasTargetInGraph) {
                        return true;
                    }

                    hasSource = true;
                }

                if (target === id) {
                    if (hasSourceInGraph) {
                        return true;
                    }

                    hasTarget = true;
                }

                if (hasSource && hasTarget) {
                    return true;
                }
            }

            return false;
        });
    }

    private getFilteredGroups (groups: Group[], nodes: Node[]): Group[] {
        const groupsIds = nodes.filter(node => Boolean(node.group)).map(node => node.group);

        return groups.filter(group => groupsIds.includes(group.id));
    }

    private async finalDraw (): Promise<void> {
        const library = this.getNeededLibrary({ type: Layouts.Cose });

        if (!(library instanceof Error)) {
            library.setBaseGraph(this.graph);
            await library.visualize(true);
        }
    }

    get(graphSubsetDescription: GraphSubsetDescription): Config {
        this.ruleCombiner.subset = graphSubsetDescription;
        return this;
    }

    useLayout(layoutDescription: LayoutDescription): void {
        this.ruleCombiner.layout = layoutDescription;
        this.rules.push(this.ruleCombiner);
        this.resetRuleCombiner();
    }

    useFor(inputGraph: InputGraph): void {
        this.inputGraph = inputGraph;
    }

    export(name: string, type?: ExportTypes): void {
        this.exportConfig = { name, type };
    }

    async build(): Promise<void> {
        this.setMarkOnNodes();
        this.checkStructureRules();

        for (const { subset, layout } of this.rules) {
            const subGraph = this.getSubGraph(subset as GraphSubsetDescription, layout?.type as Layouts);
            const library = this.getNeededLibrary(layout);

            this.checkLayoutRules(subGraph, layout as LayoutDescription);

            if (!(library instanceof Error)) {
                library.setBaseGraph(this.graph);
                library.addSubgraph(subGraph);
                this.graph = await library.visualize();
            }
        }

        await this.finalDraw();

        if (this.exportConfig) {
            const canvas = this.container.querySelector('canvas');

            if (canvas) {
                const { name, type } = this.exportConfig;

                FileSaver.saveCanvasAs(canvas, name, type);
            }
        }
    }
}

export { Config };