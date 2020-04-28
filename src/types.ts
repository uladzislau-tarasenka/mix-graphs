import { Layouts } from './constants'

export type Node = {
    group?: number,
    id: number,
    label: string,
    type: string,
};

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


export type Edge = {
    source: number,
    target: number,
    isBidirected: boolean,
};

export type Group = {
    id: number,
    label: string,
};

export type InputGraph = {
    type: string,
    node: Node[],
    edges: Edge[],
    groups: Group[],
};