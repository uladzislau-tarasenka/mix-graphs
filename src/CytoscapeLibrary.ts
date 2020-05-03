import cytoscape from 'cytoscape';

import { Library } from 'Library';

class CytoscapeLibrary implements Library {
    private instance: null;

    constructor (container: HTMLElement, options) {
        this.instance = cytoscape({ container });
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

export { CytoscapeLibrary };