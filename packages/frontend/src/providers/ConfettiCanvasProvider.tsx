import { useEffect } from "react";

export function ConfettiCanvasProvider(props: { children: React.ReactNode }) {
  useEffect(() => {
    const confettiCanvas = document.createElement("canvas");
    confettiCanvas.id = "confetti-canvas";
    confettiCanvas.style.position = "fixed";
    confettiCanvas.style.pointerEvents = "none";
    confettiCanvas.style.top = "0";
    confettiCanvas.style.left = "0";
    confettiCanvas.style.width = "100%";
    confettiCanvas.style.height = "100%";
    confettiCanvas.style.zIndex = "1000";

    document.body.appendChild(confettiCanvas);

    return () => {
      if (confettiCanvas) {
        confettiCanvas.remove();
      }
    };
  }, []);

  return <>{props.children}</>;
}
