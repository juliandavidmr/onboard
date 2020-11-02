import { CommonSelection } from "..";
import { NodeComponent } from "../node/node";
import { Pin } from "../pin/pin";
import { ExtensionParams } from "./base";

export function install(args: ExtensionParams) {
    const { eventManager, d3, root } = args;

    const containerLines = d3.select(root).append('svg')
        .attr("width", args.width)
        .attr("height", args.height)

    let svgLine: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
    let pinSource: Pin;

    eventManager.on('pin:drag:start', (event) => {
        svgLine = containerLines
            .append("line")
            .attr("x1", event.x)
            .attr("x2", event.x)
            .attr("y1", event.y)
            .attr("y2", event.y)
            .attr("stroke", "black");

        pinSource = event.target.__data__.pin;
    })

    eventManager.on('pin:drag:dragging', (event) => {
        const x = (event.x);
        const y = (event.y);

        svgLine
            .attr("x2", x)
            .attr("y2", y)
    })

    eventManager.on('pin:drag:end', (event) => {
        const data = event.target.__data__;
        if (data) {
            console.log(data);
            const pinTarget: Pin = data.pin;
            pinSource.connectTo(pinTarget, svgLine);
        } else {
            svgLine.exit();
            svgLine.remove()
        }
    })

    eventManager.on('node:drag:start', event => {
        console.log('node drag', event)
    })

    eventManager.on('node:drag:dragging', event => {
        const node: NodeComponent = event.node;
        node.outputs.map(o => {
            const [x, y] = getCentedRectangle(o.referencePin.node());

            o.connectedTo.map(conn => {
                (conn.extra as CommonSelection<SVGLineElement>)
                    .attr("x1", x)
                    .attr("y1", y)
            });
        })

        node.inputs.map(o => {
            const [x, y] = getCentedRectangle(o.referencePin.node());

            o.connectedTo.map(conn => {
                (conn.extra as CommonSelection<SVGLineElement>)
                    .attr("x2", x)
                    .attr("y2", y)
            });
        })
    })
}

function getCentedRectangle(el: HTMLElement) {
    var rect = el.getBoundingClientRect();

    const centerX = rect.x + (rect.width / 2)
    const centerY = rect.y + (rect.height / 2)
    return [centerX, centerY]
}