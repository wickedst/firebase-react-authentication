import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";
// import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";
import firebaseDeleteUser from "../../../utils/firebaseDeleteUser";

const schema = yup.object({
  password: yup
    .string()
    .required("You must enter your password correctly to delete your account"),
});

const DeleteAccount = () => {
  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { addToasts } = useContext(AuthContext);

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
          onSubmit={(data, { setSubmitting, setFieldError }) => {
            firebaseDeleteUser(data.password)
              .then(() => {
                setSubmitting(false);
                addToasts((prevToasts: any) => [
                  ...prevToasts,
                  { variant: "info", message: "Account deleted successfully" },
                ]);
              })
              .catch((error) => {
                console.log(error);
                setFieldError("password", "Password didn't match");
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
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
