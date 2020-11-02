import { GlobalEvents } from "../editor/editor";
import { Events } from "../events/events";
import * as d3 from "d3";

export interface ExtensionParams {
    root: string,
    eventManager: Events<GlobalEvents>;
    d3: typeof d3;
    width: number;
    height: number;
}