import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

const MyField = (props: any) => {
  const [field, value] = useField(props);
  console.log("value ", value);

  // const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <>
      <Form.Check
        custom
        type="switch"
        {...field}
        {...props}
        id={props.name}
        // {...value}
        defaultChecked={value.value}
        // isValid={meta.touched && !meta.error && meta.value}
        // isInvalid={meta.touched && meta.error}
      />
      {/* {props.useValidFeedback ? (
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      ) : null}
      <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback> */}
    </>
  );
};

export default MyField;
