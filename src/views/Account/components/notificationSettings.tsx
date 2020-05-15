import React, { useState } from "react";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormFieldCheckbox from "../../../components/FormFields/FormFieldCheckbox";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import firebase from "../../../firebase";
import "firebase/firestore";
import firebaseUpdateUserPrivate from "../../../utils/firebaseUpdateUserPrivate";
import firebaseGetAuth from "../../../utils/firebaseGetAuth";

const NotificationSettings = (props: { notificationSettings: {} }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { notificationSettings = {} } = props;
  const uid = firebaseGetAuth()?.uid;

  const handleSubmit = (data: {}) => {
    const payload = { notificationSettings: data };
    console.log(payload);
    setIsSubmitting(true);
    uid &&
      firebaseUpdateUserPrivate(payload, uid).then(() =>
        setIsSubmitting(false)
      );
  };

  return (
    <Formik
      initialValues={notificationSettings}
      enableReinitialize={true}
      onSubmit={(data) => {
        console.log(data);
        handleSubmit(data);
      }}
    >
      {() => (
        <FormikForm>
          <h4>Notification events</h4>
          <p className="text-muted">Notify me when...</p>
          <Form.Group>
            <FormFieldCheckbox
              type="switch"
              name="notificationWhenWall"
              label="Someone posts on my wall"
            />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox
              type="switch"
              name="notificationWhenLike"
              label="Someone likes my profile"
            />
          </Form.Group>
          <h4>Notification types</h4>
          <p className="text-muted">Notify me how...</p>
          <Form.Group>
            <FormFieldCheckbox
              type="switch"
              name="notificationTypeDrawer"
              label="Tray notifications"
            />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox
              type="switch"
              name="notificationTypeEmail"
              label="Email"
            />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox
              type="switch"
              name="notificationTypePush"
              label="Push notifications (enable in this browser)"
            />
          </Form.Group>
          {/* prettier-ignore */}
          <button disabled={isSubmitting} type="submit" className={`btn btn-primary btn-block`} >
              {isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
              ) : (
                "Update Notification Settings"
              )}
            </button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default NotificationSettings;
