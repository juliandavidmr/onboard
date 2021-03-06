import './editor.scss';
import { NodeComponent, NodeEvents } from '../node/node';
import { Events } from '../events/events';
import { ExtensionParams } from '../extensions/base';
import * as d3 from 'd3';
import { PinEvents } from '../pin/pin.model';

export interface SchemaArgs {
    name: string;
    root: string;
    nodes: NodeComponent[];
    width?: number;
    height?: number;
}

export type GlobalEvents = PinEvents | NodeEvents;

export class Editor {
    static staticId = 1;
    private readonly eventManager = new Events<GlobalEvents>();
    id: string;

    constructor(private readonly config: SchemaArgs) {
      if (config.nodes && config.nodes.length === 0) {
        console.error('Config not provided nodes');
      }

      this.id = `editor-${config.name ? config.name.trim() + '-' : ''}${Editor.staticId++}`;

      d3.select(config.root)
        .append('div')
        .attr('id', this.id)
        .classed('editor', true)
        .exit();

      config.nodes.map((node) => this.assocNode(node));
    }

    assocNode(node: NodeComponent) {
      node.assoc('#' + this.id);
      node.eventManager = this.eventManager;
    }

    addNode(node: NodeComponent) {
      if (this.config.nodes.find(n => n.key === node.key)) {
        console.error('This node already exists');
      }
      // todo
    }

    on = this.eventManager.on.bind(this.eventManager);
    emit = this.eventManager.emit.bind(this.eventManager);

    install(extension: { install: (args: ExtensionParams) => void }) {
      if (extension && typeof extension.install === 'function') {
        extension.install({
          root: '#' + this.id,
          eventManager: this.eventManager,
          d3: d3,
          editor: this
        });
      } else {
        console.error('Cannot install extension.', extension);
      }
    }

    toJSON() {
      return {
        nodes: this.config.nodes.map(n => n.toJSON())
      };
    }
}
