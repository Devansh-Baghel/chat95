import { useEffect, useState } from "react";

export default function usePuter() {
  const [puter, setPuter] = useState(null);

  useEffect(() => {
    // If already loaded, use the existing puter object
    if (window.puter) {
      setPuter(window.puter);
      return;
    }

    // Dynamically load the Puter.js script
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;

    script.onload = () => {
      if (window.puter) {
        setPuter(window.puter);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return puter;
}
