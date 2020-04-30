import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import { AuthContext } from "../../../AuthProvider";

import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = () => {
  const authContext = useContext(AuthContext);
  const { loadingAuthState } = useContext(AuthContext);
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });

  const db = firebase.firestore();

  useEffect(() => {
    // check if user is logged in
    firebase
      .auth()
      .getRedirectResult()
      // if not logged in, do nothing and display form
      .then((result) => {
        if (result.user) {
          console.log("firebase.auth", firebase.auth());
          history.push("/dashboard");
        } else if (!result || !result.user || !firebase.auth().currentUser) {
          return;
        }

        // if logged in redirect to dashboard
        return setUserProfile().then(() => {
          history.push("/dashboard");
        });
      })
      .catch((error) => {
        console.log(error, "error");
      });
  });

  const setUserProfile = async () => {
    if (await isUserExists()) {
      return;
    }

    const currentUser = firebase.auth().currentUser!;
    db.collection("Users")
      .doc(currentUser.uid)
      .set({
        username: currentUser.displayName,
      })
      .then(() => {
        console.log("Saved");
        return;
      })
      .catch((error) => {
        // handleError
        console.log(error.message);
      });
  };

  const isUserExists = async () => {
    // what if user does not exist? Send alert
    const doc = await db
      .collection("users")
      .doc(firebase.auth().currentUser!.uid)
      .get();
    return doc.exists;
  };

  const handleLogin = (data: any) => {
    setIsSubmitting(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((res) => {
        setIsSubmitting(false);
        authContext.setUser(res);
        console.log(res, "res");
        history.push("/dashboard");
      })
      .catch((error) => {
        setIsSubmitting(false);
        // handleError
        setAlert({ show: true, type: "danger", messages: [error.message] });
        console.log(error.message);
      });
  };

  const handleSocialClick = (sns: any) => {
    console.log(sns, "sns");

    let provider: firebase.auth.AuthProvider;
    switch (sns) {
      case "Facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        console.log(provider, "fbprovider");
        break;

      case "Google":
        provider = new firebase.auth.GoogleAuthProvider();
        console.log(provider, "gprovider");
        break;

      case "Twitter":
        provider = new firebase.auth.TwitterAuthProvider();
        break;

      default:
        throw new Error("Unsupported SNS" + sns);
    }

    firebase.auth().signInWithRedirect(provider).catch(handleAuthError);
  };

  const handleAuthError = (error: firebase.auth.Error) => {
    console.log(error);
  };

  if (loadingAuthState) {
    return (
      <div
        className="position-absolute d-flex w-100 h-100 align-items-center justify-content-center"
        style={{ top: 0 }}
      >
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-4 text-center">
      <h1>Login</h1>
      <Formik
        validationSchema={schema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (data) => {
          handleLogin(data);
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
            <p className="small mt-2 mb-1">Not registered? <Link to="/auth/signup">Sign up</Link></p>
            {/* prettier-ignore */}
            <p className="small">Forgot Password? <Link to="/forgot-password">Click here</Link></p>
          </FormikForm>
        )}
      </Formik>

      <div className="signup-social mt-4">
        <h2>Social Login</h2>
        <button className="btn" onClick={() => handleSocialClick("Facebook")}>
          SignIn with Facebook
        </button>
        <button className="btn" onClick={() => handleSocialClick("Google")}>
          SignIn with Google
        </button>
        <button className="btn" onClick={() => handleSocialClick("Twitter")}>
          SignIn with Twitter
        </button>
      </div>
    </div>
  );
};

export default Login;
