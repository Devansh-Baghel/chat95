import { Frame, Hourglass, Monitor } from "react95";
import React from "react";

export default function LoadingPage() {
  return (
    <Frame
      variant="outside"
      className="min-h-screen w-full p-3 flex! flex-col gap-3 items-center justify-center"
    >
      <div className="flex flex-col gap-2 items-center justify-center">
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
      </div>
    </Frame>
  );
}
