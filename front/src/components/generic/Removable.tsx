import React, { ReactElement, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createUseStyles } from "react-jss";

const styles = () => ({
  wrapper: {
    position: "relative",
    marginTop: "10px",
    marginRight: "10px",
  },
  removeButton: {
    background: "#ee3333",
    display: "flex",
    alignItems: "center",
    height: "25px",
    width: "25px",
    color: "white",
    borderRadius: "50%",
    border: "none",
    justifyContent: "center",
    position: "absolute",
    top: "-10px",
    right: "-10px",
  },
});

const useStyles = createUseStyles(styles, { name: "Removable" });

interface Props {
  children: ReactNode;
  onRemove?: () => void;
}

// TODO: fix or remove animation

const Removable = ({ children, onRemove }: Props) => {
  const classes = useStyles();
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          transition={{ duration: 0.15 }}
          variants={{
            open: { opacity: 1, width: "auto", height: "auto" },
            collapsed: { opacity: 0, width: 0, height: 0 },
          }}
        >
          <div className={classes.wrapper}>
            <button className={classes.removeButton} onClick={onRemove}>
              X
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Removable;