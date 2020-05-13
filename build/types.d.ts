import { Layouts, Rankers, RankDirection, CoseQuality, Animation } from './constants';
export declare type Dictionary<T> = Record<string, T>;
export declare type GenericObject = Dictionary<any>;
export declare type GraphSubsetDescription = {
    group?: number;
    id?: number;
    label?: string;
    type?: string;
};
export declare type LayoutDescription = {
    type: Layouts;
};
export declare type Fa2LayoutDescription = LayoutDescription & {
    avoidOverlap?: number;
    centralGravity?: number;
    damping?: number;
    gravitationalConstant?: number;
    springConstant?: number;
    springLength?: number;
    theta?: number;
};
export declare type AvsdfLayoutDescription = LayoutDescription & {
    animate?: Animation | false;
    animationDuration?: number;
    fit?: boolean;
    nodeSeparation?: number;
    padding?: boolean;
    refresh?: number;
    ungrabifyWhileSimulating?: boolean;
    ready?(): void;
    stop?(): void;
};
export declare type CoseLayoutDescription = LayoutDescription & {
    animate?: Animation | false;
    animationDuration?: number;
    animationEasing?: string;
    edgeElasticity?: number;
    fit?: boolean;
    gravity?: number;
    gravityCompound?: number;
    gravityRange?: number;
    gravityRangeCompound?: number;
    idealEdgeLength?: number;
    initialEnergyOnIncremental?: number;
    nestingFactor?: number;
    nodeDimensionsIncludeLabels?: boolean;
    nodeRepulsion?: number;
    nodeSeparation?: number;
    numIter?: number;
    packComponents?: boolean;
    padding?: number;
    piTol?: number;
    quality?: CoseQuality;
    randomize?: boolean;
    sampleSize?: number;
    samplingType?: boolean;
    tile?: boolean;
    tilingPaddingHorizontal?: number;
    tilingPaddingVertical?: number;
    uniformNodeDimensions?: boolean;
    ready?(): void;
    stop?(): void;
};
export declare type DagreLayoutDescription = LayoutDescription & {
    animate?: Animation | false;
    animationDuration?: number;
    animationEasing?: string;
    boundingBox: Dictionary<number>;
    edgeSep?: number;
    fit?: boolean;
    nodeDimensionsIncludeLabels?: boolean;
    nodeSep?: number;
    padding?: number;
    rankDir: RankDirection;
    rankSep?: number;
    ranker?: Rankers;
    spacingFactor?: number;
    animateFilter?(node: any, i: any): boolean;
    edgeWeight?(edge: any): number;
    minLen?(edge: any): number;
    ready?(): void;
    stop?(): void;
    transform?(node: any, pos: any): number;
};
export declare type Rule = {
    subset: GraphSubsetDescription | null;
    layout: LayoutDescription | null;
};
export declare type RuleCheck = {
    name: string;
    checkFunction(params: Dictionary<any>): boolean;
};
export declare type LayoutSettingRuleParams = {
    settings: GenericObject;
    subGraph: InputGraph;
};
export declare type Node = {
    group?: number;
    id: number;
    label: string;
    type: string;
};
export declare type Edge = {
    source: number;
    target: number;
    isBidirected?: boolean;
};
export declare type Position = {
    x: number;
    y: number;
};
export declare type PositionedNode = Node & Position;
export declare type MarkedNode = Node & {
    markedLayouts: Layouts[];
};
export declare type Group = {
    id: number;
    label: string;
};
export declare type InputGraph = {
    type: string;
    nodes: Node[];
    edges: Edge[];
    groups?: Group[];
};
export declare type PositionedGraph = InputGraph & {
    nodes: PositionedNode[];
};
export declare type Warning = {
    message: string;
    data: Rule;
};
