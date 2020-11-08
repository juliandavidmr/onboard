import './pin.scss';
import * as d3 from 'd3';
import { Events } from '../events/events';
import { GlobalEvents } from '../editor/editor';
import { NodeComponent } from '../node/node';
import { generateUUID } from '../utils/uuid';
import { CommonSelection } from '..';
import { PinArgs, PinJSON } from './pin.model';

const symbolKey = Symbol('ob-pin');
declare const SymbolKeyType: typeof symbolKey;

export class Pin {
  referencePin: CommonSelection<HTMLDivElement>;
  eventManager?: Events<GlobalEvents>;
  nodeParent: NodeComponent | undefined;
  connectedTo: { pin: Pin, extra: any }[] = []
  private readonly __props__: { [SymbolKeyType]: string };

  constructor(
    private text: string,
    private ref: string,
    private config: PinArgs = {}
  ) {
    this.__props__ = {
      [symbolKey]: generateUUID()
    };

    this.referencePin = d3.create('div');
    this.referencePin.attr('ref', this.ref)
      .classed('node-input', true)
      .attr('title', this.text)
      .data([{
        key: this.getKey(),
        pin: this
      }]);
  }

  getKey() {
    return this.__props__[symbolKey];
  }

  assoc(inout: CommonSelection<HTMLDivElement>) {
    const self = this;

    const el = inout!.append(() => this.referencePin!.node());

    function drag(ev: d3.D3DragEvent<HTMLElement, null, null>) {
      self.eventManager?.emit('pin:drag:dragging', {
        x: ev.sourceEvent.layerX,
        y: ev.sourceEvent.layerY,
        target: ev.sourceEvent.target,
        pin: self
      });
    }

    function end(ev: d3.D3DragEvent<HTMLElement, null, null>) {
      self.eventManager?.emit('pin:drag:end', {
        x: ev.sourceEvent.layerX,
        y: ev.sourceEvent.layerY,
        target: ev.sourceEvent.target,
        ev,
        pin: self
      });
    }

    const dragEvent = d3.drag()
      .on('start', function (ev: d3.D3DragEvent<HTMLElement, null, null>) {
        self.eventManager?.emit('pin:drag:start', {
          x: ev.sourceEvent.layerX,
          y: ev.sourceEvent.layerY,
          target: ev.sourceEvent.target,
          ev,
          pin: self
        });
      })
      .on('drag', drag)
      .on('end', end);

    dragEvent(el as any);
  }

  getNode() {
    return this.referencePin!.node();
  }

  connectTo(pin: Pin, extra?: any) {
    if (this.connectedTo.findIndex(c => c.pin.getKey() === pin.getKey()) === -1) {
      this.connectedTo.push({ pin, extra });
      pin.connectTo(this, extra);
    }
  }

  remove() {
    this.referencePin!.remove();
  }

  fromJSON(pinArgs: PinJSON): Pin {
    const pin = new Pin(pinArgs.text, pinArgs.ref || '', pinArgs.config);
    pin.__props__[symbolKey] = pinArgs.key;
    return pin;
  }

  toJSON(): PinJSON {
    return {
      text: this.text,
      ref: this.ref,
      key: this.getKey(),
      config: this.config
    };
  }
}
