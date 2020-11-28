import { ConnectionCoords } from "./pin.model";

export class Connection {

    constructor(
        private x1: number = 0,
        private y1: number = 0,
        private x2: number = 0,
        private y2: number = 0
    ) {
    }

    origin(args?: Partial<{ x1: number, y1: number }>) {
        this.x1 = typeof args?.x1 === 'number' && args.x1 >= 0 ? args.x1 : this.x1;
        this.y1 = typeof args?.y1 === 'number' && args.y1 >= 0 ? args.y1 : this.y1;
        return { x1: this.x1, y1: this.y1 };
    }

    target(args?: Partial<{ x2: number, y2: number }>) {
        this.x2 = typeof args?.x2 === 'number' && args.x2 >= 0 ? args.x2 : this.x2;
        this.y2 = typeof args?.y2 === 'number' && args.y2 >= 0 ? args.y2 : this.y2;
        return { x2: this.x2, y2: this.y2 };
    }

    toJSON(): ConnectionCoords {
        return {
            ...this.origin,
            ...this.target
        } as ConnectionCoords
    }
}