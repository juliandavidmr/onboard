# d3-node-editor

Node editor with inputs and outputs based on [d3.js](https://d3js.org/).

![](./demo.png)

## How it works?

- [x] No canvas.
- [x] Based on [d3.js](https://d3js.org/).

## TODO

- [ ] Events.
- [ ] Export/Import JSON.
- [x] Node Connector.

## Example

```ts
import { Editor, NodeComponent, Pin } from "./d3-node-editor";
import * as Connector from "./d3-node-editor/extensions/connectors.ext";

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
Node2.addOutputPin(new Pin("out1", "Output 1"));

Node3.addInputPin(new Pin("in1", "Input 1"));
Node3.addOutputPin(new Pin("out1", "Output 1"));
Node3.addOutputPin(new Pin("out2", "Output 2"));
Node3.addOutputPin(new Pin("out3", "Output 3"));

editor.installExtension(Connector.install);
```

## Development

1. Clone
2. `npm install`
3. `npm run start`
4. Open http://localhost:1234

**License**

[MIT](./LICENSE)

**You are free to contribute to this project. :)**