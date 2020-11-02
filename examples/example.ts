import { Editor, NodeComponent, Pin } from "../";
import * as Connector from "../src/extensions/connectors";

const root = "#root";

const Node1 = new NodeComponent({ title: "Node1" });
const Node2 = new NodeComponent({ title: "Node2" });
const Node3 = new NodeComponent({ title: "Node3" });

const editor = new Editor({
    name: "schema1",
    root,
    nodes: [Node1, Node2, Node3],
    width: 700,
    height: 800
});

Node1.addInputPin(new Pin("out1", "Output 1"));

Node2.addInputPin(new Pin("in1", "Input 1"));
Node2.addInputPin(new Pin("in2", "Input 2"));
Node2.addOutputPin(new Pin("out1", "Output 1"));

Node3.addInputPin(new Pin("in1", "Input 1"));
Node3.addOutputPin(new Pin("out1", "Output 1"));
Node3.addOutputPin(new Pin("out2", "Output 2"));
Node3.addOutputPin(new Pin("out3", "Output 3"));

editor.installExtension(Connector.install);