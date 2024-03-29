import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createUseStyles } from "react-jss";
import { Icon } from "./styling/Icon";

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
  children?: ReactNode;
  onRemove: () => void;
}

const Removable = ({ children, onRemove }: Props) => {
  const classes = useStyles();
  const [isHRemoved, setIsHRemoved] = useState(false);
  const durationInSec = 0.15;

  function removeWithAnimation() {
    setIsHRemoved(true);
    setTimeout(() => onRemove(), durationInSec * 1000);
  }

  return (
    <AnimatePresence initial={false}>
      {!isHRemoved && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          transition={{ duration: durationInSec }}
          variants={{
            open: { opacity: 1, width: "auto", height: "auto" },
            collapsed: { opacity: 0, width: 0, height: 0 },
          }}
        >
          <div className={classes.wrapper}>
            <button
              className={classes.removeButton}
              onClick={() => removeWithAnimation()}
            >
              <Icon icon={"cross"} />
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Removable;
