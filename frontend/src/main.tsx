import React from "react";
import ReactDOM from "react-dom/client";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - App is implemented in JSX without explicit TS declarations.
import App from "./App";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
