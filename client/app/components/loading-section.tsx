import React from "react";
import { Hourglass, Monitor } from "react95";

export default function LoadingSection() {
  return (
    <Monitor
      backgroundStyles={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Hourglass className="size-10!" />
      <span className="text-2xl">Loading...</span>
    </Monitor>
  );
}
