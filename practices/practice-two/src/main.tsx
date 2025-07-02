import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { scan } from "react-scan";

// styles
import "./index.css";

// components
import App from "./App";

scan({ enabled: true });

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
