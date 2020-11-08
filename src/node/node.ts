import './node.scss';
import * as d3 from 'd3';
import { Events } from '../events/events';
import { GlobalEvents } from '../editor/editor';
import { Pin } from '../pin/pin';
import { CommonSelection } from '..';
import { generateUUID } from '../utils/uuid';

interface NodeComponentArgs {
    title: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export type NodeEvents = 'node:drag:start' | 'node:drag:dragging' | 'node:drag:end';

export class NodeComponent<S = any> {
    key = generateUUID();
    referenceNode: CommonSelection<HTMLDivElement>;
    referenceOutputsNode: CommonSelection<HTMLDivElement>;
    referenceInputsNode: CommonSelection<HTMLDivElement>;
    outputs: Pin[] = [];
    inputs: Pin[] = [];
    eventManager: Events<GlobalEvents> | undefined;
    readonly nodeEventManager: Events<string> = new Events();
    referenceRenderer: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | undefined;
    private state: S = {} as S;

    constructor(private readonly configNode: NodeComponentArgs) {
      console.log(configNode);
    }

    assoc(root: string) {
      const width = (this.configNode && this.configNode.width) || 180;

      this.referenceNode = d3
        .select(root)
        .append('div')
        .style('width', width + 'px')
        .attr('draggable', true)
        .attr('class', 'node-component');

      const contentCard = this.referenceNode
        .append('div')
        .style('position', 'relative');

      const header = contentCard
        .insert('div')
        .attr('class', 'node-header');

      header
        .append('div')
        .text(this.configNode.title)
        .attr('class', 'node-title');

      const contentNode = contentCard
        .append('div')
        .attr('class', 'node-content');

      this.referenceInputsNode = contentNode
        .append('div')
        .attr('class', 'node-inputs');

      this.referenceRenderer = contentNode
        .append('div')
        .attr('class', 'node-content-renderer');

      this.referenceOutputsNode = contentNode
        .append('div')
        .attr('class', 'node-outputs');

      this.installDrag();
    }

    setState(newState: S) {
      this.state = { ...newState };
    }

    getState() {
      return this.state;
    }

    installDrag() {
      const self = this;
      let deltaX: number, deltaY: number;

      const dragEvent = d3
        .drag()
        .on('start', function (event: any) {
          const current = d3.select(this);
          deltaX = Math.abs(Number(current.attr('data-x') || '0') - event.x);
          deltaY = Math.abs(Number(current.attr('data-y') || '0') - event.y);

          current.classed('node-component--drag-start', true);

          self.eventManager?.emit('node:drag:start', {
            x: deltaX,
            y: deltaY,
            node: self,
            target: this
          });
        })
        .on('drag', function (event: any) {
          const x = event.x - deltaX;
          const y = event.y - deltaY;

          const current = d3.select(this);

          current.classed('node-component--drag-start', false);
          current.classed('node-component--drag-dragging', true);

          current
            .style('transform', `translate(${x}px, ${y}px)`)
            .attr('data-x', x)
            .attr('data-y', y);

          self.eventManager?.emit('node:drag:dragging', {
            x,
            y,
            node: self,
            target: this
          });
        })
        .on('end', function (event: any) {
          const current = d3.select(this);

          current.classed('node-component--drag-dragging', false);

          self.eventManager?.emit('node:drag:end', {
            node: self,
            target: this
          });
        });

      dragEvent(this.referenceNode as any);
    }

    addInput(pin: Pin) {
      this.inputs.push(pin);
      pin.assoc(this.referenceInputsNode);
      pin.node = this;
      pin.eventManager = this.eventManager;
        this.referenceInputsNode!.append(() =>
          pin.getNode()
        );
    }

    addOutput(pin: Pin) {
      this.outputs.push(pin);
      pin.assoc(this.referenceOutputsNode);
      pin.node = this;
      pin.eventManager = this.eventManager;
        this.referenceOutputsNode!.append(() =>
          pin.getNode()
        );
    }

    render(renderer: (el: HTMLDivElement, node?: NodeComponent) => any) {
      if (typeof renderer === 'function') {
        const el = this.referenceRenderer!.node() as HTMLDivElement;
        renderer(el, this);
      } else {
        console.warn('Render not contains a function arg');
      }
    }

    broadcast(eventName: string, data: any) {
      for (const output of this.outputs) {
        for (const connection of output.connectedTo) {
          connection.pin.node?.nodeEventManager?.emit(eventName, data);
        }
      }
    }

    on = this.nodeEventManager.on.bind(this.nodeEventManager);

    destroy() {
      this.referenceNode?.remove();
    }

    // Events

    onDestroy() {}
}
