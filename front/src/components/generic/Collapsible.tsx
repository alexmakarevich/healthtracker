import React, { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isExpanded: boolean;
  children: ReactElement;
}

const Collapsible = ({ isExpanded, children }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          transition={{ duration: 0.8, ease: [0.5, 0.62, 0.23, 0.98] }}
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0.5, height: 0 },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Collapsible };
