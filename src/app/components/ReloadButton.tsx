"use client";

import { RefreshCcw } from "lucide-react";
import { useRef } from "react";

export default function ReloadButton({ handler }: { handler: () => void }) {
  const iconRef = useRef<SVGSVGElement>(null);

  return (
    <button
      onClick={() => {
        if (iconRef.current) {
          const icon = iconRef.current;
          const currentRotation =
            parseFloat(
              icon.style.transform.match(/rotate\((.*?)\)/)
                ? icon.style.transform.match(/rotate\((.*?)\)/)![1]
                : "0"
            ) || 0;

          // Calculate the new rotation value, ensuring it stays within 0-360 degrees
          const newRotation = (currentRotation + 360) % 360;

          // Apply the rotation using the transform property
          icon.style.transform = `rotate(${newRotation}deg)`;
        }
        return handler();
      }}
      className="border border-gray-400 rounded-md p-2"
    >
      <RefreshCcw
        size={"1em"}
        color="gray"
        ref={iconRef}
        className="transition-all"
      />
    </button>
  );
}
