import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";
import firebaseGetAuth from "../../../utils/firebaseGetAuth";
import { firestore, auth } from "firebase";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";

const schema = yup.object({
  deleteAccountConfirm: yup.string().required(),
});

const DeleteAccount = () => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const uid = firebaseGetAuth()?.uid;
  const { addToasts } = useContext(AuthContext);
  const history = useHistory();
  // modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAccount = async () => {
    const usersRef = firestore().collection("users");
    const usersPrivateRef = firestore().collection("usersPrivate");

    await usersRef.doc(uid).delete();
    await usersPrivateRef.doc(uid).delete();
    auth()
      .signOut()
      .then(() => {
        history.push("/");
        addToasts((prevToasts: any) => [
          ...prevToasts,
          { variant: "info", message: "Account deleted successfully" },
        ]);
      });
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
            deleteAccountConfirm: "",
          }}
          onSubmit={() => {
            handleDeleteAccount();
          }}
        >
          <FormikForm>
            <Modal.Body>
              <p>
                Are you sure you want to delete your account? This change is
                irreversible.
              </p>
              <p>
                Type <span className="font-weight-bold">DELETE</span> below and
                click OK to confirm.
              </p>
              <Form.Group>
                <FormField
                  placeholder="DELETE"
                  name="deleteAccountConfirm"
                  type="text"
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
        </Formik>
      </Modal>
    </>
  );
};

export default DeleteAccount;
