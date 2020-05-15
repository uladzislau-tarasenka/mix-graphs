import intersection from 'lodash/intersection';

import { RuleCheck, MarkedNode, GraphSubsetDescription, Edge, LayoutSettingRuleParams } from "./types";
import { Layouts } from "./constants";
import { GraphHelper } from "./GraphHelper";

export const COSE_AVSDF_INTERSECTION_RULE: RuleCheck = {
    name: 'Avoiding usage of Cose and Avsdf in subgraphs intersection',
    checkFunction: ({ node }: { node: MarkedNode }) => !(node.markedLayouts.includes(Layouts.Cose)
        && node.markedLayouts.includes(Layouts.Avsdf))
}

export const AVSDF_INTERSECTION_RULE: RuleCheck = {
    name: 'Avoiding case when subgraphs which have nodes intersection use Avsdf',
    checkFunction: ({ nodes, avsdfSubsets }: { nodes: MarkedNode[], avsdfSubsets: GraphSubsetDescription[] }) => {
        const avsdfNodes = nodes.filter(node => node.markedLayouts.includes(Layouts.Avsdf));

        if (avsdfNodes.length > 0) {
            for (const node of avsdfNodes) {
                let usedInCount = 0;

                for (const subset of avsdfSubsets) {
                    if (GraphHelper.isFitSubset(node, subset)) {
                        usedInCount++;
                    }

                    if (usedInCount > 1) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
};

export const DARGE_AVSDF_INTERSECTION_RULE: RuleCheck = {
    name: 'Avoiding usage of Dagre and Avsdf in subgraphs intersection which contains more than 1 node',
    checkFunction: ({
            markedNodes,
            avsdfSubset,
            dagreSubset
        }: {
            markedNodes: MarkedNode[],
            avsdfSubset: GraphSubsetDescription,
            dagreSubset: GraphSubsetDescription
        }) => {
        const nodes = markedNodes.filter(node => node.markedLayouts.includes(Layouts.Avsdf)
            && node.markedLayouts.includes(Layouts.Dagre));

        if (nodes.length > 1) {
            const avsdfNodeIds = GraphHelper.getSubsetIds(nodes, avsdfSubset);
            const dagreNodeIds = GraphHelper.getSubsetIds(nodes, dagreSubset);
            const idsIntersection = intersection(avsdfNodeIds, dagreNodeIds);

            if (idsIntersection.length > 1) {
                return false;
            }
        }

        return true;
    }
};

export const ACYCLE_RULE: RuleCheck = {
    name: 'Subgraph using Dagre is acyclic',
    checkFunction: ({ edges }: { edges: Edge[] }) => {
        return !GraphHelper.detectCycle(edges);
    },
};

export const FA2_LAYOUT_SETTINGS_RULES: RuleCheck[] = [
    {
        name: 'Follow Spring Length range',
        checkFunction: ({ settings, subGraph }: LayoutSettingRuleParams) => {
            const { springLength } = settings;

            if (springLength < 50 || springLength > 200) {
                return false;
            }

            return true;
        },
    },
];

export const COSE_LAYOUT_SETTINGS_RULES: RuleCheck[] = [
    {
        name: 'Follow Nesting Factor range',
        checkFunction: ({ settings, subGraph }: LayoutSettingRuleParams) => {
            const { nestingFactor } = settings;

            if (nestingFactor > 3) {
                return false;
            }

            return true;
        },
    }
];

export const AVSDF_LAYOUT_SETTINGS_RULES: RuleCheck[] = [
    {
        name: 'Follow Node Separation range',
        checkFunction: ({ settings, subGraph }: LayoutSettingRuleParams) => {
            const { nodeSeparation } = settings;

            if (nodeSeparation < 50 || nodeSeparation > 100) {
                return false;
            }

            return true;
        },
    }
];

export const DARGE_LAYOUT_SETTINGS_RULES: RuleCheck[] = [
];

export const LayoutSettingsRules = {
    [Layouts.Fa2]: FA2_LAYOUT_SETTINGS_RULES,
    [Layouts.Cose]: COSE_LAYOUT_SETTINGS_RULES,
    [Layouts.Avsdf]: AVSDF_LAYOUT_SETTINGS_RULES,
    [Layouts.Dagre]: DARGE_LAYOUT_SETTINGS_RULES,
};


