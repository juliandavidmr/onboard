import { CommonSelection } from "..";
import { NodeComponent } from "../node/node";
import { Pin } from "../pin/pin";
import { ExtensionParams } from "./base";

export function install(args: ExtensionParams) {
    const { eventManager, d3, root } = args;

    const containerLines = d3.select(root).append('svg')
        .attr("width", args.width)
        .attr("height", args.height)

    let svgLine: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
    let pinSource: Pin;
    let originalX, originalY;

    eventManager.on('pin:drag:start', (event) => {
        originalX = event.x
        originalY = event.y
        const path = defaultPath([event.x, event.y, event.x, event.y], .5)

        svgLine = containerLines
            .append("path")
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '4px')
            .attr('d', path);

        pinSource = event.target.__data__.pin;
    })

    eventManager.on('pin:drag:dragging', (event) => {
        const x = (event.x);
        const y = (event.y);
        const path = defaultPath([originalX, originalY, x, y], .5)
        svgLine.attr('d', path)
    })

    eventManager.on('pin:drag:end', (event) => {
        const data = event.target.__data__;
        if (data) {
            const pinTarget: Pin = data.pin;
            pinSource.connectTo(pinTarget, svgLine);
        } else {
            svgLine.exit();
            svgLine.remove()
        }
    })

    /// Drag

    eventManager.on('node:drag:start', event => {
        console.log('node drag', event)
    })

    eventManager.on('node:drag:dragging', event => {
        const node: NodeComponent = event.node;

        node.outputs.map(o => {
            const [x, y] = getCentedRectangle(o.referencePin.node());

            o.connectedTo.map(conn => {
                const pathD = (conn.extra as CommonSelection<SVGLineElement>).node().getAttribute('d');
                const points = getPoints(pathD)
                points[0] = x;
                points[1] = y;

                (conn.extra as CommonSelection<SVGLineElement>)
                    .attr('d', defaultPath(points, .5))
            });
        })

        node.inputs.map(o => {
            const [x, y] = getCentedRectangle(o.referencePin.node());

            o.connectedTo.map(conn => {
                const pathD = (conn.extra as CommonSelection<SVGLineElement>).node().getAttribute('d');
                const points = getPoints(pathD)
                points[2] = x;
                points[3] = y;

                (conn.extra as CommonSelection<SVGLineElement>)
                    .attr('d', defaultPath(points, .5))
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


export function defaultPath(points: number[], curvature: number) {
    const [x1, y1, x2, y2] = points;
    const hx1 = x1 + Math.abs(x2 - x1) * curvature;
    const hx2 = x2 - Math.abs(x2 - x1) * curvature;

    return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`;
}

function getPoints(d: string): number[] {
    const m = d.match(/(([0-9]+)(\.[0-9])?)/g)
    const r = m.map(Number) as number[]
    return [r[0], r[1], r[6], r[7]]
}