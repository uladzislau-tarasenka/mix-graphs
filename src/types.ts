import { Layouts } from './constants'

export type Dictionary<T> = Record<string, T>;
export type GenericObject = Dictionary<any>;

export type GraphSubsetDescription = {
    group?: number,
    id?: number,
    label?: string,
    type?: string,
};

export type LayoutDescription = {
    type: Layouts,
    [name: string]: any,
};

export type Rule = {
    subset: GraphSubsetDescription | null,
    layout: LayoutDescription | null,
};

export type Node = {
    group?: number,
    id: number,
    label: string,
    type: string,
};

export type Edge = {
    source: number,
    target: number,
    isBidirected: boolean,
};

export type Position = {
    x: number,
    y: number,
}

export type InternalNode = Node & Position;

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

export type InternalGraph = {
    type: string,
    nodes: InternalNode[],
    edges: Edge[],
    groups?: Group[],
};

export type Warning = {
    message: string,
    data: Rule
}