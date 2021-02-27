import { createElement } from "react";
import { render } from "react-dom";
import { App } from "./App/App";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
render(createElement(App), root);
