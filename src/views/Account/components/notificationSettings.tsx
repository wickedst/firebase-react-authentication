import React, { useState } from "react";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormFieldCheckbox from "../../../components/FormFields/FormFieldCheckbox";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const NotificationSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <Formik
      initialValues={{
        notificationWhenWall: true,
        notificationWhenLike: false,
        //
        notificationTypeDrawer: false,
        notificationTypeEmail: false,
        notificationTypePush: false,
      }}
      onSubmit={(data) => {
        console.log(data);
      }}
    >
      {(initialValues) => (
        <FormikForm>
          <h4>Notification events</h4>
          <p className="text-muted">Notify me when...</p>
          <Form.Group>
            <FormFieldCheckbox
              name="notificationWhenWall"
              label="Someone posts on my wall"
            />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox
              name="notificationWhenLike"
              label="Someone likes my profile"
            />
          </Form.Group>
          <h4>Notification types</h4>
          <p className="text-muted">Notify me how...</p>
          <Form.Group>
            <FormFieldCheckbox
              name="notificationTypeDrawer"
              label="Tray notifications"
            />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox name="notificationTypeEmail" label="Email" />
          </Form.Group>
          <Form.Group>
            <FormFieldCheckbox
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
