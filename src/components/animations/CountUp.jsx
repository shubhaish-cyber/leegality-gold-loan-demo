import { useState, useEffect } from "react";

export default function CountUp({ target, duration = 800, prefix = "", suffix = "" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const num = typeof target === "string" ? parseInt(target.replace(/[^\d]/g, ""), 10) : target;
    if (!num || isNaN(num)) { setCurrent(num || 0); return; }

    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  const formatted = current.toLocaleString("en-IN");
  return <>{prefix}{formatted}{suffix}</>;
}
