import React, { useState, useContext } from "react";
import firebase from "firebase";
import { firestore } from "firebase";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";
import firebaseGetAuth from "../../../utils/firebaseGetAuth";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";

const schema = yup.object({
  password: yup.string().required(),
});

const DeleteAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const uid = firebaseGetAuth()?.uid;
  const { addToasts } = useContext(AuthContext);
  const history = useHistory();
  // modal
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAccount = async (password: string) => {
    console.log(password);
    setIsSubmitting(true);

    const usersRef = firestore().collection("users");
    const usersPrivateRef = firestore().collection("usersPrivate");
    const user = firebase.auth().currentUser;
    // re-authenticate user...
    if (user && user.email) {
      const cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      user
        .reauthenticateWithCredential(cred)
        .then(async () => {
          // ... then delete
          await usersRef.doc(user.uid).delete();
          await usersPrivateRef.doc(user.uid).delete();
          user
            .delete()
            // auth()
            //   .signOut()
            .then(() => {
              setIsSubmitting(false);

              history.push("/");
              addToasts((prevToasts: any) => [
                ...prevToasts,
                { variant: "info", message: "Account deleted successfully" },
              ]);
            })
            .catch((error) => {
              setIsSubmitting(false);
              console.log(error.message);
            });
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.log(error.message);
        });
    }
  };

  return (
    <>
      <p className="text-muted">Can not be reversed</p>
      <button className="btn btn-block btn-danger" onClick={handleShow}>
        Delete my account
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account Confirmation</Modal.Title>
        </Modal.Header>

        <Formik
          validationSchema={schema}
          initialValues={{
            password: "",
          }}
          onSubmit={(data) => {
            console.log(data);
            handleDeleteAccount(data.password);
          }}
        >
          {() => (
            <FormikForm>
              <Modal.Body>
                <p>
                  Are you sure you want to delete your account? This change is
                  irreversible.
                </p>
                <p>
                  <span className="font-weight-bold">
                    Re-enter your password
                  </span>{" "}
                  to confirm deletion.
                </p>
                <Form.Group>
                  <FormField
                    placeholder="Your Password"
                    name="password"
                    type="password"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                {/* prettier-ignore */}
                <button disabled={isSubmitting} type="submit" className={`btn btn-primary`} >
              {
              isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
                // prettier-ignore
              ) : ( "Confirm")
              }
            </button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default DeleteAccount;
