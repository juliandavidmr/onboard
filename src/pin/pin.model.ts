export interface PinArgs {
    multipleConnection?: boolean;
}

export type PinMouseEvents = 'pin:click';
export type PinDragEvents = 'pin:drag:start' | 'pin:drag:dragging' | 'pin:drag:end';
export type PinEvents = PinDragEvents | PinMouseEvents;

export interface PinJSON {
    text: string;
    ref?: string;
    key: string;
    config?: PinArgs;
}
