import { useEffect, useRef } from "react";
import confetti, { CreateTypes } from "canvas-confetti";

export function useConfetti() {
  const confettiInstanceRef = useRef<CreateTypes | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const confettiCanvas = document.getElementById("confetti-canvas");
    if (confettiCanvas === null) {
      console.warn("Failed to find canvas element with id 'confetti-canvas'");
    }
    const confettiInstance = confetti.create(confettiCanvas as HTMLCanvasElement, {
      resize: true,
      useWorker: true,
    });

    confettiCanvasRef.current = confettiCanvas as HTMLCanvasElement;
    confettiInstanceRef.current = confettiInstance as unknown as CreateTypes;

    // Remove the canvas when the component unmounts
    return () => {
      if (confettiCanvasRef.current) {
        document.body.removeChild(confettiCanvasRef.current);
        confettiCanvasRef.current = null;
      }
      confettiInstanceRef.current = null;
    };
  }, []);

  // Return a function that triggers the confetti effect
  return () => {
    if (confettiInstanceRef.current) {
      console.info("showing confetti");
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      confettiInstanceRef.current({
        disableForReducedMotion: true,
        particleCount: 200,
        spread: 360,
      });
    }
  };
}
