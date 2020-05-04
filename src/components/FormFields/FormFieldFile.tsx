import React from "react";
import Form from "react-bootstrap/Form";
import { useField, useFormikContext } from "formik";

const MyField = (props: any) => {
  const [field, meta] = useField(props);

  const { values, setFieldValue } = useFormikContext();

  const handleChange = async (e: any) => {
    const file = await e.currentTarget.files[0];
    setFieldValue(field.name, file);
  };

  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <>
      <Form.File custom className="text-left">
        <Form.File.Input
          {...field}
          {...props}
          value=""
          isValid={meta.touched && !meta.error && meta.value}
          isInvalid={meta.value && meta.error}
          onChange={(o: any) => handleChange(o)}
        />
        <Form.File.Label
          data-browse="Browse"
          style={{ whiteSpace: "nowrap", overflow: "hidden" }}
        >
          {props.label}
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
