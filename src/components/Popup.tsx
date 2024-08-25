/// <reference types="vite-plugin-svgr/client" />
import "./Popup.css";
import Icon from "../../assets/icons/icon-24.png";

import { TotalCoversions, TotalCoversionsProps } from "./Containers/Conversion";
import { predictUse } from "../selection";
import { useEffect, useState } from "react";

// Offset of the popup from the cursor - [x, y]
const POPUP_OFFSET = [6, 8];

function MatchContainer(containerType: string, props: unknown) {
  switch (containerType) {
    case "conversion":
      return <TotalCoversions {...(props as TotalCoversionsProps)} />;
    case "error":
      return <p>Error :(</p>;
    case "none":
      return <p>Shouldn't be shown</p>;
  }
}

function Popup() {
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  const [containerType, setContainerType] = useState("error");
  const [containerProps, setContainerProps] = useState<unknown>(null);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      // Skip if inside popup
      if (
        document.getElementById("predict-modal")?.contains(event.target as Node)
      ) {
        return;
      }

      const selection = document.getSelection()?.toString();
      if (!selection) {
        return;
      }

      const [prediction, props] = predictUse(selection);
      setContainerType(prediction);
      setContainerProps(props);

      if (prediction != "none") {
        setShowPopup(true);
      }

      setPopupX(event.pageX + POPUP_OFFSET[0]);
      setPopupY(event.pageY + POPUP_OFFSET[1]);
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (
        document.getElementById("predict-modal")?.contains(event.target as Node)
      ) {
        setShowContainer(true);
      } else {
        setShowPopup(false);
        setShowContainer(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return showPopup ? (
    <div className="popup" style={{ top: popupY, left: popupX }}>
      {showContainer ? (
        <div className="popup_container">
          {MatchContainer(containerType, containerProps)}
        </div>
      ) : (
        <div className="popup_prompt">
          <img src={Icon} />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default Popup;
