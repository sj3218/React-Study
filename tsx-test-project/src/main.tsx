import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UIProvider } from "./context/UIContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
		<UIProvider>
			<App />
		</UIProvider>
		</BrowserRouter>
	</StrictMode>,
);
