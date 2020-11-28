import { Connection } from './pin.connection';
import { Pin } from "./pin";

export interface PinArgs {
    multipleConnection?: boolean;
    key?: string;
}

export type PinMouseEvents = 'pin:click' | 'pin:click:up';
export type PinDragEvents = 'pin:drag:start' | 'pin:drag:dragging' | 'pin:drag:end';
export type PinEvents = PinDragEvents | PinMouseEvents;

export interface PinJSON {
    text: string;
    ref?: string;
    key: string;
    config?: PinArgs;
}

export interface ConnectedTo {
    pin: Pin
    extra: any
    connection?: Connection
}

export interface ConnectionCoords {
    x1: number
    y1: number
    x2: number
    y2: number
}