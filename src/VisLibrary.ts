import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

import { Library } from 'Library';

class VisLibrary implements Library {
    private instance: null;

    constructor (container: HTMLElement, options) {
        this.instance = new Network(container, {});
    }

    private decode () {
        
    }

    private encode () {

    }

    setBaseGraph () {
        
    }

    addSubgraph () {

    }

    visualize () {
        
    }
}

export { VisLibrary };