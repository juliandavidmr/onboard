import "./node.scss"
import * as d3 from "d3";
import { Events } from "../events/events";
import { GlobalEvents } from "../editor/editor";
import { Pin } from "../pin/pin";
import { CommonSelection } from "..";

interface NodeComponentArgs {
    title: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export type NodeEvents = 'node:drag:start' | 'node:drag:dragging' | 'node:drag:end';

export class NodeComponent {
    referenceNode: CommonSelection<HTMLDivElement>;
    referenceOutputsNode: CommonSelection<HTMLDivElement>;
    referenceInputsNode: CommonSelection<HTMLDivElement>;
    outputs: Pin[] = [];
    inputs: Pin[] = [];
    eventManager: Events<GlobalEvents> | undefined;

    constructor(private readonly configNode: NodeComponentArgs) { }

    assoc(root: string) {
        const width = (this.configNode && this.configNode.width) || 180;
        const height = (this.configNode && this.configNode.height) || 180;

        this.referenceNode = d3
            .select(root)
            .append("div")
            .style("width", width + "px")
            .attr("draggable", true)
            .attr("class", "node-component");

        const contentCard = this.referenceNode
            .append("div")
            .style("position", "relative");

        const header = contentCard
            .insert("div")
            .attr("class", "node-header");

        header
            .append("div")
            .text(this.configNode.title)
            .attr("class", "node-title");

        const contentNode = contentCard
            .append("div")
            .attr("class", "node-content");

        this.referenceInputsNode = contentNode
            .append("div")
            .attr("class", "node-inputs");

        this.referenceOutputsNode = contentNode
            .append("div")
            .attr("class", "node-outputs");

        this.installDrag()(this.referenceNode as any);
    }

    installDrag() {
        const self = this;
        let deltaX: number, deltaY: number;
        let zIndex = 1;

        return d3
            .drag()
            .on("start", function (event: any) {
                const current = d3.select(this);
                deltaX = Math.abs(Number(current.attr("data-x") || "0") - event.x);
                deltaY = Math.abs(Number(current.attr("data-y") || "0") - event.y);
                current.style("box-shadow", "0px 2px 11px rgb(153, 153, 153)");
                current.style("z-index", 1000);
                current.style("cursor", "grab")
                self.eventManager?.emit('node:drag:start', {
                    x: deltaX,
                    y: deltaY,
                    node: self,
                    target: this
                });
            })
            .on("drag", function (event: any) {
                const x = event.x - deltaX;
                const y = event.y - deltaY;

                const current = d3.select(this);
                current
                    .style("transform", `translate(${x}px, ${y}px)`)
                    .attr("data-x", x)
                    .attr("data-y", y);

                current.style("cursor", "grabbing")
                self.eventManager?.emit('node:drag:dragging', {
                    x,
                    y,
                    node: self,
                    target: this
                });
            })
            .on("end", function (event: any) {
                const current = d3.select(this);
                current.style("box-shadow", null);
                current.style("z-index", zIndex);
                current.style("cursor", "grab")
                self.eventManager?.emit('node:drag:end', {
                    node: self,
                    target: this
                });
            });
    }

    addInputPin(pin: Pin) {
        this.inputs.push(pin);
        pin.assoc(this.referenceInputsNode);
        pin.node = this;
        pin.eventManager = this.eventManager;
        this.referenceInputsNode!.append(() =>
            pin.getNode(),
        );
    }

    addOutputPin(pin: Pin) {
        this.outputs.push(pin);
        pin.assoc(this.referenceOutputsNode);
        pin.node = this;
        pin.eventManager = this.eventManager;
        this.referenceOutputsNode!.append(() =>
            pin.getNode(),
        );
    }
}
