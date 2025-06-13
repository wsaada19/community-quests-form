import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfettiCanvasProvider } from "./providers/ConfettiCanvasProvider.tsx";
import { RTKCacheProvider } from "./providers/RTKCacheProvider.tsx";
import RTKStoreProvider from "./providers/RTKStoreProvider.tsx";
import { CustomNameProvider } from "./providers/CustomNameProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTKStoreProvider>
      <RTKCacheProvider>
        <CustomNameProvider>
          <ConfettiCanvasProvider>
            <App />
          </ConfettiCanvasProvider>
        </CustomNameProvider>
      </RTKCacheProvider>
    </RTKStoreProvider>
  </StrictMode>
);
