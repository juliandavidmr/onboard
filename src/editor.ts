import { NodeComponent } from "./node";
// import * as d3 from "d3";

export interface SchemaArgs {
    name: string;
    root: string;
    nodes: NodeComponent[];
}

export class Editor {
    constructor(private config: SchemaArgs) {
        if (config.nodes && config.nodes.length === 0) {
            console.error(`Config not provided nodes`);
        }

        config.nodes.map((node) => node.assoc(config.root));
    }

    addNode(node: NodeComponent) {
        node.assoc(this.config.root);
    }
}
