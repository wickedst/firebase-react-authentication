import React, { useState } from "react";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";
import { firebaseUpdateUserPassword } from "../../../utils/firebaseUpdateUserPassword";

const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: string;
    messages: [string];
  }>({ show: false, type: "", messages: [""] });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        passwordCurrent: "",
        password: "",
        passwordConfirmation: "",
      }}
      onSubmit={(data) => {
        setIsSubmitting(true);
        firebaseUpdateUserPassword(data.passwordCurrent, data.password)
          .then((res) => {
            console.log(res);
            setIsSubmitting(false);
          })
          .catch((error) => {
            console.log(error);
            setAlert({
              show: true,
              type: "danger",
              messages: [error.message],
            });
            setIsSubmitting(false);
          });
      }}
    >
      {() => (
        <FormikForm>
          {alert.show && (
            <div className={`alert alert-${alert.type} small`}>
              {alert.messages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )}
          <Form.Group>
            <FormField
              placeholder="Current Password"
              name="passwordCurrent"
              type="password"
              autoComplete="new-password"
            />
          </Form.Group>
          <Form.Group>
            <FormField
              placeholder="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
          </Form.Group>
          <Form.Group>
            <FormField
              placeholder="Confirm Password"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
            />
          </Form.Group>
          {/* prettier-ignore */}
          <button disabled={isSubmitting} type="submit" className={`btn btn-primary btn-block`} >
              {isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
              ) : (
                "Update Password"
              )}
            </button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default ChangePassword;
