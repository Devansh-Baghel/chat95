import React from "react";
import { Hourglass, Monitor } from "react95";

export default function LoadingSection({ image }: { image?: boolean }) {
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
      {/* <span className="text-2xl">
        {image ? "Generating image..." : "Loading..."}
      </span> */}

      {image ? (
        <span className="text-xl ml-2">Generating image...</span>
      ) : (
        <span className="text-2xl">Loading...</span>
      )}
    </Monitor>
  );
}
