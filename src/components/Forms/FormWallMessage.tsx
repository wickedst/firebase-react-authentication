import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormField from "../FormFields/FormField";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";
import firebaseGetAuth from "../../utils/firebaseGetAuthId";

const schema = yup.object({
  message: yup.string().required().min(1).max(350),
});

interface FormWallMessageProps {
  onAddMessage: (message: any) => void;
}

const FormWallMessage: React.FC<FormWallMessageProps> = (props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { userProfile } = useContext(AuthContext);

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        message: "",
      }}
      onSubmit={(data) => {
        const uid = firebaseGetAuth()?.uid;
        setIsSubmitting(true);
        if (firebaseGetAuth() && userProfile) {
          let message = {
            timestamp: Date.now(),
            message: data.message,
            user: {
              uid,
              username: userProfile.username,
              slug: userProfile.slug,
              profilePicture: userProfile.profilePicture,
            },
          };
          props.onAddMessage(message);
        }
        setIsSubmitting(false);
      }}
    >
      {() => (
        <FormikForm>
          <Form.Group>
            <FormField placeholder="Message" name="message" type="textarea" />
          </Form.Group>
          {/* prettier-ignore */}
          <button disabled={isSubmitting} type="submit" className={`btn btn-primary btn-block`} >
              {isSubmitting ? (
                // prettier-ignore
                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
              ) : (
                "Submit"
              )}
            </button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default FormWallMessage;
