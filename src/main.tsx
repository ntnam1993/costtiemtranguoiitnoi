import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./styles.css";

registerSW({ immediate: true });

const root = document.getElementById("root");
if (root === null) throw new Error("Không tìm thấy phần tử gốc của ứng dụng");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
