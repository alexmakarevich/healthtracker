import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../../context/ContextWrapper";
import { usePrevious } from "../../../hooks/usePrevious";
import { Alert } from "../layout/Alert";
import { v4 as uuid } from "uuid";
import { PartialPartial } from "../../../utils/utils";

interface AlertContextProps {
  children: ReactNode;
}

interface AlertObject {
  content: ReactNode;
  id: string;
}

const [useAlertContext, AlertContextProvider] = createContextDefined<{
  addAlert: ({ content, id }: PartialPartial<AlertObject, "id">) => void;
}>();

const styles = () => {
  const padding = "20px";
  return {
    container: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translate(-50%, 0)",
      // right: 0,
      width: "100%",
      maxWidth: "400px",
      padding: "20px",
      textAlign: "center",
      display: "inline-block",
    },
  };
};

const useStyles = createUseStyles(styles, { name: "AlertContext" });

export const AlertContext = ({ children }: AlertContextProps) => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState<AlertObject[]>([]);
  const prevAlerts = usePrevious(alerts);

  useEffect(() => {
    if (alerts.length > (prevAlerts?.length ?? 0)) {
      const timeout = setTimeout(() => {
        console.log("delete");
        console.log(alerts.length, prevAlerts?.length);

        setAlerts((alerts) => alerts.slice(1));
        return () => {
          clearTimeout(timeout);
        };
      }, 5000);
    }
  }, [alerts]);

  const addAlert = useCallback(
    ({ content, id = uuid() }: PartialPartial<AlertObject, "id">) => {
      // max 5 items at once
      setAlerts((alerts) => [...alerts.slice(-4), { content, id }]);
      return id;
    },
    [setAlerts]
  );

  const removeAlert = useCallback(
    (id: string) => {
      setAlerts((currAlerts) => {
        const index = currAlerts.findIndex((alert) => alert.id === id);
        console.log({ currAlerts, index });

        return [...currAlerts.slice(0, index), ...currAlerts.slice(index + 1)];
      });
    },
    [setAlerts]
  );

  return (
    <AlertContextProvider value={{ addAlert }}>
      {children}
      <div className={classes.container}>
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert key={i} onRemove={() => removeAlert(alert.id)}>
                {alert.content}
              </Alert>
            </motion.li>
          ))}
        </AnimatePresence>
      </div>
    </AlertContextProvider>
  );
};

export { useAlertContext };
