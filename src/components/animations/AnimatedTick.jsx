import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedTick({ show, onComplete }) {
  const [phase, setPhase] = useState("circle"); // circle → tick → hold → done

  useEffect(() => {
    if (!show) {
      setPhase("circle");
      return;
    }
    const t1 = setTimeout(() => setPhase("tick"), 400);
    const t2 = setTimeout(() => setPhase("hold"), 700);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && phase !== "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Circle */}
            <motion.circle
              cx="60" cy="60" r="50"
              fill="none" stroke="#1D9E75" strokeWidth="4"
              strokeDasharray="314"
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Tick */}
            {(phase === "tick" || phase === "hold") && (
              <motion.path
                d="M35 60 L52 77 L85 44"
                fill="none" stroke="#1D9E75" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="80"
                initial={{ strokeDashoffset: 80 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
