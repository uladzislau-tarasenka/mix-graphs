import { GraphSubsetDescription, InputGraph, LayoutDescription } from './types';
import { ExportTypes } from './constants';
export interface IConfig {
    get(graphSubsetDescription: GraphSubsetDescription): void;
    useLayout(layoutDescription: LayoutDescription): void;
    useFor(graphStructure: InputGraph): void;
    export(exportName: string, exportType?: ExportTypes): void;
    build(): void;
}
declare class Config implements IConfig {
    private container;
    private graph;
    private inputGraph;
    private markedNodes;
    private rules;
    private ruleCombiner;
    private exportConfig;
    constructor(container: HTMLElement);
    private resetRuleCombiner;
    private setMarkOnNodes;
    private checkStructureRules;
    private checkLayoutRules;
    private checkRule;
    private getNeededLibrary;
    private getSubGraph;
    private getFilteredNodes;
    private getFilteredEdges;
    private getFilteredGroups;
    l: any;
    private finalDraw;
    get(graphSubsetDescription: GraphSubsetDescription): Config;
    useLayout(layoutDescription: LayoutDescription): void;
    useFor(inputGraph: InputGraph): void;
    export(name: string, type?: ExportTypes): void;
    build(): Promise<void>;
}
export { Config };
