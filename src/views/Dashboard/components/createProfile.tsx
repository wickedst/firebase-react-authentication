import React, { useState } from "react";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import firebaseGetAuth from "../../../utils/firebaseGetAuthId";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

const schema = yup.object({
  username: yup
    .string()
    .required()
    .min(3)
    .max(15)
    .matches(
      /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
      "Can not contain spaces or special characters"
    ),
});

const CreateProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });
  const history = useHistory();

  const handleCreateProfile = async (data: { username: string }) => {
    setIsSubmitting(true);
    // prettier-ignore
    const auth = firebaseGetAuth();

    const db = firebase.firestore();
    // create username entry in usernames collection
    // username / slug will be added to users collection document via cloud function
    const uid = auth ? auth.uid : "";
    await db
      .collection("usernames")
      .doc(auth?.uid)
      .set({
        username: data.username,
      })
      .then(() => {
        db.collection("usernames")
          .doc("list")
          .update({
            [uid]: data.username,
          });
        // push createdProfile: true to userProfile context
        history.push("dashboard");
        setIsSubmitting(false);
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
      <h1>Create your profile</h1>
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
                {alert.messages.map((message, index) => (
                  <div key={index}>{message}</div>
                ))}
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
                "Sign Up"
              )}
            </button>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default CreateProfile;
