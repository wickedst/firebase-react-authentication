import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import { AuthContext } from "../../../AuthProvider";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";

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
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

const SignUp = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });

  const handleSignup = (data: any) => {
    // check if username exists in cloud function
    setIsSubmitting(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((userCredential: firebase.auth.UserCredential) => {
        authContext.setUser(userCredential);
        // check if user exists
        const db = firebase.firestore();
        db.collection("Users")
          .doc(userCredential.user!.uid)
          .set({
            email: data.email,
            username: data.username,
          })
          .then(() => {
            setIsSubmitting(false);
            history.push("/dashboard");
          })
          .catch((error) => {
            setIsSubmitting(false);
            setAlert({ show: true, type: "danger", messages: [error.message] });
            console.log(error.message);
          });
      })
      .catch((error) => {
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
              <FormField placeholder="Username" name="username" type="input" />
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
                "Login"
              )}
            </button>
            {/* prettier-ignore */}
            <p className="small mt-2">Already registered? <button onClick={() => history.push("/auth/login")} className="btn btn-sm btn-link" >Login</button> </p>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
