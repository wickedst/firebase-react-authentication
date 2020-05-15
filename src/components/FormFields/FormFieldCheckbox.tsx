import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

const MyField = (props: any) => {
  const [field, meta] = useField(props);
  const [myTouched, setMyTouched] = useState(false);

  let checked = meta.initialValue;
  if (myTouched && !meta.touched && meta.initialValue) {
    checked = false;
  } else if (meta.touched) {
    checked = meta.value;
  }

  console.log(checked);

  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          custom
          {...field}
          {...props}
          className="form-check-input"
          name={props.name}
          id={props.name}
          value={props.name}
          checked={meta.value || false}
          defaultChecked={meta.initialValue}
        />
        <label className="form-check-label"> Default radio </label>
      </div>{" "}
    </>
  );
};

export default MyField;
