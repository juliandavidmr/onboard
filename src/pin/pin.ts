import "./pin.scss";
import * as d3 from "d3";
import { Events } from "../events/events";
import { GlobalEvents } from "../editor/editor";
import { NodeComponent } from "../node/node";
import { generateUUID } from "../utils/uuid";
import { CommonSelection } from "..";

interface PinArgs {
    multipleConnection?: boolean;
}

export type PinEvents = 'pin:drag:start' | 'pin:drag:dragging' | 'pin:drag:end';

export class Pin {
    referencePin: CommonSelection<HTMLDivElement>;
    eventManager?: Events<GlobalEvents>;
    node: NodeComponent | undefined;
    connectedTo: { pin: Pin, extra: any }[] = []
    private readonly key = generateUUID();

    constructor(
        private ref: string,
        private text: string,
        private config: PinArgs = {}
    ) { }

    assoc(inout: CommonSelection<HTMLDivElement>) {
        const self = this;

        this.referencePin = inout!.append("div")
            .attr('ref', this.ref)
            .classed("node-input", true)
            .classed("node-input-" + this.ref, true)
            .attr("title", this.text)
            .data([{
                key: this.key,
                pin: this
            }]);

        const drag = d3.drag()
            .on('start', function (ev: d3.D3DragEvent<HTMLElement, null, null>) {
                self.eventManager?.emit('pin:drag:start', {
                    x: ev.sourceEvent.layerX,
                    y: ev.sourceEvent.layerY,
                    target: ev.sourceEvent.target,
                    ev
                });
            }).on('drag', function (ev: d3.D3DragEvent<HTMLElement, null, null>) {
                self.eventManager?.emit('pin:drag:dragging', {
                    x: ev.sourceEvent.layerX,
                    y: ev.sourceEvent.layerY,
                    target: ev.sourceEvent.target
                });
            }).on('end', function (ev: d3.D3DragEvent<HTMLElement, null, null>) {
                self.eventManager?.emit('pin:drag:end', {
                    x: ev.sourceEvent.layerX,
                    y: ev.sourceEvent.layerY,
                    target: ev.sourceEvent.target,
                    ev
                });
            })

        drag(this.referencePin as any)

        return this.referencePin;
    }

    getNode() {
        return this.referencePin!.node();
    }

    connectTo(pin: Pin, extra?: any) {
        if (this.connectedTo.findIndex(c => c.pin.key === pin.key) === -1) {
            this.connectedTo.push({ pin, extra })
            pin.connectTo(this, extra);
        }
    }

    remove() {

    }
}
