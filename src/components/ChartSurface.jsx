import { useEffect, useRef, useState } from "react";

function ChartSkeleton() {
  return (
    <div className="chart-surface-skeleton" aria-hidden="true">
      <span className="chart-surface-bar h-[34%]" />
      <span className="chart-surface-bar h-[56%]" />
      <span className="chart-surface-bar h-[42%]" />
      <span className="chart-surface-bar h-[72%]" />
      <span className="chart-surface-bar h-[48%]" />
      <span className="chart-surface-bar h-[64%]" />
    </div>
  );
}

export default function ChartSurface({ className = "", children }) {
  const frameRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return undefined;

    const updateSize = () => {
      const nextWidth = Math.round(node.clientWidth);
      const nextHeight = Math.round(node.clientHeight);

      setSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    const rafId = window.requestAnimationFrame(updateSize);
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateSize);
    });

    observer.observe(node);
    window.addEventListener("orientationchange", updateSize);
    window.addEventListener("resize", updateSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("orientationchange", updateSize);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const isReady = size.width > 40 && size.height > 40;

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      {isReady ? children(size) : <ChartSkeleton />}
    </div>
  );
}
