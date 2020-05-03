import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import Toast from "./toast";

const Toasts = () => {
  const { toasts } = useContext(AuthContext);
  const ftoasts =
    toasts &&
    toasts.map((toast: { variant: string; message: string }, index: number) => {
      return <Toast content={toast} key={index} />;
    });
  return <>{ftoasts}</>;
};

export default Toasts;
