import { Editor, NodeComponent } from "../";
import { PinInput } from "../src/input";
import { PinOutput } from "../src/output";

const root = "#root";

const Node1 = new NodeComponent({ title: "Node1" });
const Node2 = new NodeComponent({ title: "Node2" });
const Node3 = new NodeComponent({ title: "Node3" });

const editor = new Editor({
    name: "schema1",
    root,
    nodes: [Node1, Node2, Node3],
});

Node1.addPin(new PinOutput("out1", "Output 1"));

Node2.addPin(new PinInput("in1", "Input 1"));
Node2.addPin(new PinOutput("out1", "Output 1"));

Node3.addPin(new PinInput("in1", "Input 1"));
Node3.addPin(new PinOutput("out1", "Output 1"));
Node3.addPin(new PinOutput("out2", "Output 2"));
Node3.addPin(new PinOutput("out3", "Output 3"));
