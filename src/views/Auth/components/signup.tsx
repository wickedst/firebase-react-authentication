import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import schema from "../../../schemas/signup.schema";
import slugify from "slugify";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });

  const handleSignup = (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    // prettier-ignore
    const usernameSlug = slugify(data.username, { remove: /[$*+~.,()'"!\-:@]/g, lower: true, });

    let userDoc = firebase.firestore().collection("users").doc(usernameSlug);
    userDoc
      .get()
      .then((doc) => {
        if (!doc.exists) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then((userCredential: firebase.auth.UserCredential) => {
              // prettier-ignore
              userDoc.set({ slug: usernameSlug, email: data.email, username: data.username, uid: userCredential.user!.uid, });
            })
            // if doc/username exists
            .catch((error: any) => {
              setIsSubmitting(false);
              // prettier-ignore
              setAlert({ show: true, type: "danger", messages: [error.message] });
            });
        } else {
          // prettier-ignore
          setAlert({ show: true, type: "danger", messages: ["Username taken"] });
        }
      })
      .then(() => {
        // Will automatically push to dashboard
        setIsSubmitting(false);
      })
      .catch((error: any) => {
        setIsSubmitting(false);
        setAlert({ show: true, type: "danger", messages: [error.message] });
        console.log(error.message);
      });
  };
  return (
    <div className="container py-4 text-center">
      <h1>Sign up</h1>
      <Formik
        validationSchema={schema}
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={(data) => {
          handleSignup(data);
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
            <Form.Group>
              <FormField
                placeholder="Email Address"
                name="email"
                type="input"
              />
            </Form.Group>
            <Form.Group>
              <FormField
                placeholder="Password"
                name="password"
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
                "Sign Up"
              )}
            </button>
            {/* prettier-ignore */}
            <p className="small mt-2">Already registered? <Link to="/auth/login">Login</Link></p>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
