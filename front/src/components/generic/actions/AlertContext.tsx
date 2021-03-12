import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { createContextDefined } from "../../../context/ContextWrapper";
import { usePrevious } from "../../../hooks/usePrevious";
import { Alert } from "../layout/Alert";

interface AlertContextProps {
  children: ReactNode;
}

interface AlertObject {
  content: ReactNode;
  id: string;
}

const [useAlertContext, AlertContextProvider] = createContextDefined<{
  addAlert: (newAlert: AlertObject) => void;
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
      }, 3000);
    }
  }, [alerts]);

  const addAlert = useCallback(
    (text: AlertObject) => {
      setAlerts((alerts) => [...alerts, text]);
    },
    [setAlerts]
  );

  // const removeAlert = useCallback(
  //   (text: ReactNode) => {
  //     setAlerts((alerts) => [...alerts, text]);
  //   },
  //   [setAlerts]

  return (
    <AlertContextProvider value={{ addAlert }}>
      {children}
      <div className={classes.container}>
        {alerts.map((alert, i) => (
          <Alert key={i}>{alert.content}</Alert>
        ))}
      </div>
    </AlertContextProvider>
  );
};

export { useAlertContext };
