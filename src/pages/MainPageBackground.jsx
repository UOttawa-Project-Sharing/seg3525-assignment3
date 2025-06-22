import React from "react";
import "./MainPageBackground.css";
import MainPageBackgroundGrid from "./MainPageBackgroundGrid";
import MainPageMenu from "./MainPageMenu";

function MainPageBackground() {
  return (
    <div className="main-bg-root">
      <MainPageBackgroundGrid />
      <MainPageMenu />
    </div>
  );
}

export default MainPageBackground;