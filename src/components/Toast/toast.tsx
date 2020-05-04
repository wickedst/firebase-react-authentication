import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";

const MyToast = (props: any) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, [props]);

  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={4000}
      autohide
      animation={true}
      className={`bg-${props.content.variant} text-center text-white border-0`}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        margin: "auto",
      }}
    >
      <Toast.Body>{props.content.message}</Toast.Body>
    </Toast>
  );
};

export default MyToast;
