import { Button, ButtonProps } from "./Button";
import { NavLink, useLocation } from "react-router-dom";

export const LinkButton = ({ to, ...rest }: { to: any } & ButtonProps) => {
  const { pathname } = useLocation();
  console.log({ pathname });

  return (
    <NavLink {...{ to, activeStyle: { opacity: 0.5 } }}>
      <Button {...rest}></Button>
    </NavLink>
  );
};
