import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

const MyField = (props: any) => {
  const [field, meta] = useField(props);

  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <>
      <Form.Control
        {...field}
        {...props}
        // type={props.type || "text"}
        // value={meta.value || ""}
        isValid={meta.touched && !meta.error && meta.value}
        isInvalid={meta.touched && meta.error}
      />
      {props.useValidFeedback ? (
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      ) : null}
      <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
    </>
  );
};

export default MyField;
