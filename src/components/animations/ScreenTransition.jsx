import { motion, AnimatePresence } from "framer-motion";

// Typeform-style vertical slide:
//   Forward: new screen enters from below (y: 40) and old exits upward (y: -40)
//   Back:    new screen enters from above (y: -40) and old exits downward (y: 40)
const variants = {
  enter: (direction) => ({
    y: direction === "forward" ? 40 : -40,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction === "forward" ? -40 : 40,
    opacity: 0,
  }),
};

export default function ScreenTransition({ screenKey, direction, children }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={screenKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
