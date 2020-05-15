import { Layouts, Rankers, RankDirection, CoseQuality, Animation } from './constants'

export type Dictionary<T> = Record<string, T>;
export type GenericObject = Dictionary<any>;

export type GraphSubsetDescription = {
    group?: number,
    id?: number,
    label?: string,
    type?: string,
};

export type LayoutDescriptionBase = {
    type: Layouts,
};

export type Fa2LayoutDescription = LayoutDescriptionBase & {
    avoidOverlap?: number,
    centralGravity?: number,
    damping?: number,
    gravitationalConstant?: number,
    springConstant?: number,
    springLength?: number,
    theta?: number,
}

export type AvsdfLayoutDescription = LayoutDescriptionBase & {
    animate?: Animation | false,
    animationDuration?: number,
    fit?: boolean,
    nodeSeparation?: number,
    padding?: boolean,
    refresh?: number,
    ungrabifyWhileSimulating?: boolean,
    ready?(): void,
    stop?(): void,
}

export type CoseLayoutDescription = LayoutDescriptionBase & {
    animate?: Animation | false,
    animationDuration?: number,
    animationEasing?: string,
    edgeElasticity?: number,
    fit?: boolean,
    gravity?: number,
    gravityCompound?: number,
    gravityRange?: number,
    gravityRangeCompound?: number,
    idealEdgeLength?: number,
    initialEnergyOnIncremental?: number,
    nestingFactor?: number,
    nodeDimensionsIncludeLabels?: boolean,
    nodeRepulsion?: number,
    nodeSeparation?: number,
    numIter?: number,
    packComponents?: boolean,
    padding?: number,
    piTol?: number,
    quality?: CoseQuality,
    randomize?: boolean,
    sampleSize?: number,
    samplingType?: boolean,
    tile?: boolean,
    tilingPaddingHorizontal?: number,
    tilingPaddingVertical?: number,
    uniformNodeDimensions?: boolean,
    ready?(): void,
    stop?(): void,
}

export type DagreLayoutDescription = LayoutDescriptionBase & {
    animate?: Animation | false,
    animationDuration?: number,
    animationEasing?: string,
    boundingBox: Dictionary<number>,
    edgeSep?: number,
    fit?: boolean,
    nodeDimensionsIncludeLabels?: boolean,
    nodeSep?: number,
    padding?: number,
    rankDir: RankDirection,
    rankSep?: number,
    ranker?: Rankers,
    spacingFactor?: number,
    animateFilter?(node, i): boolean,
    edgeWeight?(edge): number,
    minLen?(edge): number,
    ready?(): void,
    stop?(): void,
    transform?(node, pos): number,
}

export type CytoscapeLayoutDescription = AvsdfLayoutDescription | DagreLayoutDescription | CoseLayoutDescription;

export type LayoutDescription = Fa2LayoutDescription | CytoscapeLayoutDescription;

export type Rule = {
    subset: GraphSubsetDescription | null,
    layout: LayoutDescription | null,
};

export type RuleCheck = {
    name: string,
    checkFunction(params: Dictionary<any>): boolean,
}

export type LayoutSettingRuleParams = {
    settings: GenericObject,
    subGraph: InputGraph,
}

export type Node = {
    group?: number,
    id: number,
    label: string,
    type: string,
};

export type Edge = {
    source: number,
    target: number,
    isBidirected?: boolean,
};

export type Position = {
    x: number,
    y: number,
}

export type PositionedNode = Node & Position;

export type MarkedNode = Node & { markedLayouts: Layouts[] };

export type Group = {
    id: number,
    label: string,
};

export type InputGraph = {
    type: string,
    nodes: Node[],
    edges: Edge[],
    groups?: Group[],
};

export type PositionedGraph = InputGraph & { nodes: PositionedNode[] };

export type GenericGraph = {
    nodes: GenericObject[],
    edges: GenericObject[],
};