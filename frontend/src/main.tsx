import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.scss";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found.");
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
