import { useEffect, useState } from "react";

export default function ProgressBar({ trigger,onComplete,theme }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
      useEffect(() => {
      if (!trigger) return;

      // defer state updates to next tick
      const timeout = setTimeout(() => {
        setVisible(true);
        setProgress(0);

        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => setVisible(false), 300);
              onComplete?.();
              return 100;
            }
            return prev + 2;
          });
        }, 10);

      }, 0);

      return () => clearTimeout(timeout);
    }, [trigger,onComplete]);


  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent">
      <div
        className={`h-0.5 ${theme? "bg-logo" : "bg-logo2"} transition-[width] duration-300 ease-linear`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
