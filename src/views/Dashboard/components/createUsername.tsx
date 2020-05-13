import React, { useState, useContext } from "react";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import firebaseGetAuth from "../../../utils/firebaseGetAuth";
import * as yup from "yup";
import { AuthContext } from "../../../AuthProvider";

const usernameIsTaken = firebase.functions().httpsCallable("usernameIsTaken");
yup.addMethod(yup.string, "usernameIsTaken", function (
  message: string = "Username taken"
) {
  return this.test("test-name", message, async function (
    value
  ): Promise<any | yup.ValidationError> {
    return await usernameIsTaken({ username: value })
      .then(function (result) {
        return !result.data;
      })
      .catch((err) => console.log(err));
  });
});
const schema = yup.object({
  username: yup
    .string()
    .required()
    // @ts-ignore
    .usernameIsTaken()
    .min(3)
    .max(15)
    .matches(
      /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
      "Can not contain spaces or special characters"
    ),
});

const CreateUsername = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });
  const { setUserProfile } = useContext(AuthContext);

  const handleCreateProfile = async (data: { username: string }) => {
    setIsSubmitting(true);
    // prettier-ignore
    const auth = firebaseGetAuth();
    const username = data.username;
    const uid = auth ? auth.uid : "";
    // Cloud function for creating unique username
    const createUsername = firebase.functions().httpsCallable("createUsername");
    createUsername({ username, uid })
      .then((result) => {
        // server side validation
        if (typeof result.data !== "boolean") {
          setIsSubmitting(false);
          let errors = result.data;
          let errorMsgs = errors.map((error: { message: string }) => {
            return error.message;
          });
          setAlert({
            show: true,
            type: "danger",
            messages: errorMsgs,
          });
        }
        // username taken
        if (result.data === false) {
          setIsSubmitting(false);
          setAlert({
            show: true,
            type: "danger",
            messages: ["Username not available"],
          });
        }
        // success
        if (result.data === true) {
          setIsSubmitting(false);
          setUserProfile(
            (profile: any) =>
              (profile = { ...profile, ...{ createdUsername: true, username } })
          );
        }
      })
      // if username can't be created, can not advance
      .catch((error) => {
        setIsSubmitting(false);
        setAlert({ show: true, type: "danger", messages: [error.message] });
        console.log(error.message);
      });
  };
  return (
    <>
      <h1>Create your username</h1>
      <p>
        You've registered using your email, [email]. Now finish your profile
      </p>
      <Formik
        validationSchema={schema}
        initialValues={{
          username: "",
        }}
        onSubmit={(data) => {
          handleCreateProfile(data);
        }}
      >
        {() => (
          <FormikForm className="offset-md-3 col-md-6">
            {alert.show && (
              <div className={`alert alert-${alert.type} small`}>
                <ul className="list-unstyled mb-0 text-left">
                  {alert.messages.map((message) => (
                    <li>{message}</li>
                  ))}
                </ul>
              </div>
            )}
            <Form.Group>
              <FormField
                placeholder="Username"
                name="username"
                type="input"
                autoComplete="username"
              />
            </Form.Group>
            {/* prettier-ignore */}
            <button disabled={isSubmitting} type="submit" className={`btn btn-primary btn-block`} >
              {isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
              ) : (
                "Submit"
              )}
            </button>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default CreateUsername;
