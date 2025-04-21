import './index.css';
// Removed 'React' import
import { render } from "react-dom";
import { App } from "./App";

const rootElement = document.getElementById("root");
if (rootElement) { // Ensure element exists before rendering
  render(<App />, rootElement);
} else {
  console.error("Failed to find the root element");
}