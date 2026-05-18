import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/geist/index.css";

import App from "./App";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
