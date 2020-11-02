import { NodeComponent, NodeEvents } from "../node/node";
import { Events } from "../events/events";
import { PinEvents } from "../pin/pin";
import { ExtensionParams } from "../extensions/base";
import * as d3 from "d3";

export interface SchemaArgs {
    name: string;
    root: string;
    nodes: NodeComponent[];
    width: number;
    height: number;
}

export type GlobalEvents = PinEvents | NodeEvents;

export class Editor {
    private readonly eventManager = new Events<GlobalEvents>();

    constructor(private readonly config: SchemaArgs) {
        if (config.nodes && config.nodes.length === 0) {
            console.error(`Config not provided nodes`);
        }

        config.nodes.map((node) => this.addNode(node));
    }

    addNode(node: NodeComponent) {
        node.assoc(this.config.root);
        node.eventManager = this.eventManager;
    }

    on = this.eventManager.on.bind(this.eventManager);
    emit = this.eventManager.emit.bind(this.eventManager);

    installExtension(extension: (args: ExtensionParams) => void) {
        if (extension && typeof extension === 'function') {
            extension({
                root: this.config.root,
                eventManager: this.eventManager,
                d3: d3,
                width: this.config.width,
                height: this.config.height
            })
        }
    }
}
