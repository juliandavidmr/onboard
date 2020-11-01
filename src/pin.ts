import { Selection } from "d3";

export class Pin {
    referenceNode:
        | Selection<
              HTMLDivElement,
              unknown,
              HTMLElement,
              any
          >
        | undefined;

    constructor(
        private ref: string,
        private text: string,
    ) {}

    assoc(inout: any) {
        this.referenceNode = inout
            .append("div")
            .attr("class", "node-input")
            .attr("title", this.text)
            .style("width", "10px")
            .style("height", "10px")
            .style("border-radius", "50%")
            .style("margin", "6px")
            .style("background-color", "#039BE5");

        return this.referenceNode;
    }

    getNode() {
        return this.referenceNode!.node();
    }
}
