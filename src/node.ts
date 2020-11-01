import * as d3 from "d3";
import { PinOutput } from "./output";
import { PinInput } from "./input";

interface NodeComponentArgs {
    title: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export type PinOption = PinOutput | PinInput;
export type El =
    | d3.Selection<
          HTMLDivElement,
          unknown,
          HTMLElement,
          any
      >
    | undefined;

export class NodeComponent {
    referenceNode: El;
    referenceOutputsNode: El;
    referenceInputsNode: El;
    outputs: PinOutput[] = [];
    inputs: PinInput[] = [];

    constructor(
        private readonly configNode: NodeComponentArgs,
    ) {}

    assoc(root: string) {
        const width =
            (this.configNode && this.configNode.width) ||
            180;
        const height =
            (this.configNode && this.configNode.height) ||
            180;

        this.referenceNode = d3
            .select(root)
            .append("div")
            .style("border", "1px solid gray")
            .style("border-radius", "6px")
            .style("position", "absolute")
            .style("width", width + "px")
            .style("background-color", "white")
            .style("transition-duration", "40ms")
            .style("box-sizing", "border-box")
            .attr("draggable", true)
            .attr("class", "node-component")
            .on("mouseover", function (d) {
                d3.select(this).style("cursor", "pointer");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("cursor", null);
            });

        const contentCard = this.referenceNode
            .append("div")
            .style("position", "relative");

        const header = contentCard
            .insert("div")
            .attr("class", "node-header")
            .style("width", "100%");

        header
            .append("div")
            .text(this.configNode.title)
            .attr("class", "node-title")
            .style("padding", "5px 10px")
            .style("border-bottom", "1px solid gray")
            .style("font-weight", 600);

        const contentNode = contentCard
            .append("div")
            .attr("class", "node-content")
            .style("display", "flex")
            .style("justify-content", "space-between");

        this.referenceInputsNode = contentNode
            .append("div")
            .attr("class", "node-inputs");

        this.referenceOutputsNode = contentNode
            .append("div")
            .attr("class", "node-outputs");

        this.installDrag()(this.referenceNode);
    }

    installDrag() {
        let deltaX: number, deltaY: number;
        let zIndex = 1;

        return d3
            .drag()
            .on("start", function (event: any) {
                const current = d3.select(this);
                deltaX = Math.abs(
                    Number(current.attr("data-x") || "0") -
                        event.x,
                );
                deltaY = Math.abs(
                    Number(current.attr("data-y") || "0") -
                        event.y,
                );
                current.style(
                    "box-shadow",
                    "0px 2px 11px rgb(153, 153, 153)",
                );
                current.style("z-index", 1000);
            })
            .on("drag", function (event: any) {
                d3.select(this)
                    .style(
                        "transform",
                        `translate(${event.x - deltaX}px, ${
                            event.y - deltaY
                        }px)`,
                    )
                    .attr("data-x", event.x - deltaX)
                    .attr("data-y", event.y - deltaY);
            })
            .on("end", function (event: any) {
                const current = d3.select(this);
                current.style("box-shadow", null);
                current.style("z-index", zIndex);
            });
    }

    addPin(pin: PinOption) {
        if (pin instanceof PinOutput) {
            this.outputs.push(pin);
            pin.assoc(this.referenceOutputsNode);
            this.referenceOutputsNode!.append(() =>
                pin.getNode(),
            );
        } else if (pin instanceof PinInput) {
            this.inputs.push(pin);
            pin.assoc(this.referenceInputsNode);
            this.referenceInputsNode!.append(() =>
                pin.getNode(),
            );
        }
    }
}
