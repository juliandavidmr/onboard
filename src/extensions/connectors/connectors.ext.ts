import { CommonSelection } from '../..';
import { NodeComponent } from '../../node/node';
import { Pin } from '../../pin/pin';
import { ExtensionParams } from '../base';
import d3 from 'd3';

export function install(args: ExtensionParams) {
  const { eventManager, d3, root } = args;

  const containerLines = d3
    .select(root)
    .append('svg')
    .style('width', '100%')
    .style('height', '100%');

  let svgLine: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
  let pinSource: Pin;
  let originalX: number, originalY: number;

  eventManager.on('pin:drag:start', (event: any) => {
    originalX = event.x;
    originalY = event.y;
    const path = defaultPath([event.x, event.y, event.x, event.y], 0.5);

    svgLine = containerLines
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '4px')
      .attr('d', path);

    pinSource = event.pin;
  });

  eventManager.on('pin:drag:dragging', (event: any) => {
    const x: number = event.x;
    const y: number = event.y;
    const path = defaultPath([originalX, originalY, x, y], 0.5);
    svgLine.attr('d', path);
  });

  eventManager.on('pin:drag:end', (event: any) => {
    const data = event.target.__data__;
    if (data) {
      const pinTarget: Pin = data.pin;
      pinSource.connectTo(pinTarget, svgLine);
    } else {
      svgLine.exit();
      svgLine.remove();
    }
  });

  /// Drag

  eventManager.on('node:drag:start', (event: any) => {
    // console.log('node drag', event);
  });

  eventManager.on('node:drag:dragging', (event: any) => {
    const node: NodeComponent = event.node;

    node.outputs.forEach(o => {
      const [x, y] = getCenterRectangle(o.referencePin!.node()!);

      o.connectedTo.forEach(conn => {
        const pathD: string = (conn.extra as CommonSelection<SVGLineElement>)!.node()!.getAttribute('d') as string;
        const points = getPoints(pathD);
        points[0] = x;
        points[1] = y;

        (conn!.extra as CommonSelection<SVGLineElement>)!.attr('d', defaultPath(points, 0.5));
      });
    });

    node.inputs.forEach(o => {
      const [x, y] = getCenterRectangle(o.referencePin!.node()!);

      o.connectedTo.forEach(conn => {
        const pathD: string = (conn.extra as CommonSelection<SVGLineElement>)!.node()!.getAttribute('d') as string;
        const points = getPoints(pathD);
        points[2] = x;
        points[3] = y;

        (conn.extra as CommonSelection<SVGLineElement>)!
          .attr('d', defaultPath(points, 0.5));
      });
    });
  });

  function getCenterRectangle(el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    const centerX = rect.x + (rect.width / 2);
    const centerY = rect.y + (rect.height / 2);
    return [centerX, centerY];
  }

  function defaultPath(points: number[], curvature: number) {
    const [x1, y1, x2, y2] = points;
    const hx1 = x1 + Math.abs(x2 - x1) * curvature;
    const hx2 = x2 - Math.abs(x2 - x1) * curvature;

    return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`;
  }

  function getPoints(d: string): number[] {
    const m = d.match(/(([0-9]+)(\.[0-9])?)/g);
    const r = m?.map(Number) as number[];
    return [r[0], r[1], r[6], r[7]];
  }
}
