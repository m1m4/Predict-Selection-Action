import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./components/Popup";

const predictModal = document.createElement("div");
predictModal.id = "predict-modal";
document.body.appendChild(predictModal);
ReactDOM.createRoot(document.getElementById("predict-modal")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
