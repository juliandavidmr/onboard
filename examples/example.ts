import { Editor, NodeComponent, Pin } from "../";
import * as Connector from "../src/extensions/connectors";

const root = "#root";

const Node1 = new NodeComponent({ title: "Node1" });
const Node2 = new NodeComponent({ title: "Node2" });
const Node3 = new NodeComponent({ title: "Node3" });

const editor = new Editor({
    name: "schema1",
    root,
    nodes: [Node1, Node2, Node3]
});

Node1.addOutput(new Pin("out1", "Output 1"));
Node1.render(function (el, node) {
    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    el.appendChild(input)

    input.style.width = '60px';
    input.addEventListener('input', function (ev) {
        const value = +(ev.target as any).value;
        node.broadcast('dataX', value)
    })
});

Node2.addOutput(new Pin("out1", "Output 1"));
Node2.render(function (el, node) {
    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    el.appendChild(input)

    input.style.width = '60px';
    input.addEventListener('input', function (ev) {
        const value = +(ev.target as any).value;
        node.broadcast('dataY', value)
    })
});

Node3.addInput(new Pin("in1", "Input 1"));
Node3.render(function (el, events) {
    const text = document.createElement('strong')
    text.textContent = '0'
    el.appendChild(text)

    let x = 0, y = 0;

    events.on('dataX', function (data) {
        x = data;
        text.textContent = `${(y + x)}`;
    })

    events.on('dataY', function (data) {
        y = data;
        text.textContent = `${(y + x)}`;
    })
});

editor.install(Connector);