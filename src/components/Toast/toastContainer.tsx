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
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        minHeight: "100px",
        width: "100%",
        bottom: 0,
      }}
    >
      {ftoasts}
    </div>
  );
};

export default Toasts;
