import { createNode, connectNodes } from "./node";

const root = "#root";
const node1 = createNode({
    title: "Node1",
    root,
});

const node2 = createNode({ title: "Node2", root });

connectNodes(node1.outputList[0], node2.inputsList[0]);
