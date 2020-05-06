import { InputGraph, InternalGraph } from "./types";

export interface Library {
    setBaseGraph(baseGraph: InternalGraph | null): void,
    addSubgraph(subGraph: InputGraph): void,
    visualize(): Promise<InternalGraph>,
}