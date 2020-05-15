import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../../../components/FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";

const schema = yup.object({
  deleteAccountConfirm: yup.string().required(),
});

const DeleteAccount = () => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          onSubmit={(data) => {
            console.log(data);
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
