import React, { ReactElement, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export enum Animations {
  ExpandHeight,
  ExpandWidth,
  ExpandBoth,
}

interface Props {
  isExpanded: boolean;
  children: ReactNode;
  animation: Animations;
}

const Collapsible = ({ isExpanded, children, animation }: Props) => {
  const expandWidth = {
    open: { opacity: 1, width: "auto" },
    collapsed: { opacity: 0, width: 0 },
  };

  const variants =
    (animation === Animations.ExpandWidth && {
      variants: {
        open: { opacity: 1, width: "auto" },
        collapsed: { opacity: 0, width: 0 },
      },
    }) ||
    (animation === Animations.ExpandHeight && {
      variants: {
        open: { opacity: 1, height: "auto" },
        collapsed: { opacity: 0, height: 0 },
      },
    }) ||
    (animation === Animations.ExpandBoth && {
      variants: {
        open: { opacity: 1, width: "auto", height: "auto" },
        collapsed: { opacity: 0, width: 0, height: 0 },
      },
    });
  //     ? {
  //         variants: {
  //           open: { opacity: 1, width: "auto" },
  //           collapsed: { opacity: 0, width: 0 },
  //         },
  //       }
  //     : {};

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          transition={{ duration: 0.15 }}
          {...variants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapsible;
