import React, { useState } from "react";
import firebase from "../../../firebase";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";

const passwordResetMessage =
  "Request recieved. If there is a user with your email address we will send you a password reset link shortly";
const schema = yup.object({
  email: yup.string().email().required(),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: string;
    messages: [string];
  }>({ show: false, type: "", messages: [""] });

  const handleSubmit = (data: { email: string }) => {
    firebase
      .auth()
      .sendPasswordResetEmail(data.email)
      .then(() => {
        setAlert({
          show: true,
          type: "success",
          messages: [passwordResetMessage],
        });
        setIsSubmitting(false);
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setAlert({
            show: true,
            type: "success",
            messages: [passwordResetMessage],
          });
        } else {
          setAlert({
            show: true,
            type: "danger",
            messages: [error.message],
          });
        }
        setIsSubmitting(false);
      });
  };

  return (
    <div className="text-center container py-4">
      <h1>Forgot Password</h1>
      <Formik
        validationSchema={schema}
        initialValues={{
          email: "",
        }}
        onSubmit={(data) => {
          setIsSubmitting(true);
          handleSubmit(data);
        }}
      >
        {() => (
          <FormikForm className="offset-md-3 col-md-6">
            {alert.show && (
              <div className={`alert alert-${alert.type} small`}>
                {alert.messages.map((message, index) => (
                  <div key={index}>{message}</div>
                ))}
              </div>
            )}
            <Form.Group>
              <FormField placeholder="Email" name="email" type="text" />
            </Form.Group>
            {/* prettier-ignore */}
            <button disabled={isSubmitting} type="submit" className={`btn btn-primary btn-block`} >
              {isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
              ) : (
                "Reset Password"
              )}
            </button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
