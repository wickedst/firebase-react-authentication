import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";

const MyToast = (props: any) => {
  const [show, setShow] = useState(true);

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
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={4000}
        autohide
        animation={true}
        className={`bg-${props.content.variant} text-center text-white`}
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
    </div>
  );
};

export default MyToast;
