import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

const MyField = (props: any) => {
  const [field, meta] = useField(props);

  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <>
      <Form.File custom className="text-left">
        <Form.File.Input
          {...field}
          {...props}
          isValid={meta.touched && !meta.error && meta.value}
          isInvalid={meta.value && meta.error}
        />
        <Form.File.Label
          data-browse="Browse"
          style={{ whiteSpace: "nowrap", overflow: "hidden" }}
        >
          {meta.value ? meta.value : props.label}
        </Form.File.Label>
        {props.useValidFeedback ? (
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        ) : null}
        <Form.Control.Feedback type="invalid">
          {errorText}
        </Form.Control.Feedback>
      </Form.File>
    </>
  );
};

export default MyField;
