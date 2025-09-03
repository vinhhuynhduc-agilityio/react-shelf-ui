import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global styles
import "./index.css";

// App
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
