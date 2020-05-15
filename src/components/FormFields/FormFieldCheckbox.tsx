import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

const MyField = (props: any) => {
  const [field, meta] = useField(props);

  return (
    <Form.Check
      {...field}
      {...props}
      name={props.name}
      id={props.name}
      value={props.name}
      checked={meta.value || false} // this line accounts for asynchronous initialValues in parent
      defaultChecked={meta.initialValue}
    />
  );
};

export default MyField;
