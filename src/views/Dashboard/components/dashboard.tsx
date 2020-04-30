import React, { useContext, useState } from "react";
import { AuthContext } from "../../../AuthProvider";

import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormFieldFile from "../../../components/FormFields/FormFieldFile";
import Spinner from "react-bootstrap/Spinner";
import * as yup from "yup";

const imageUpload = (image: string) => {
  console.log(image);
};

const schema = yup.object({
  profilePicture: yup
    .string()
    .required()
    .matches(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i, "Must be a valid image type"),
});

const UploadProfilePicture = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // prettier-ignore
  const [alert, setAlert] = useState<{ show: boolean; type: string; messages: [string] }>({ show: false, type: "", messages: [""] });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        profilePicture: "",
      }}
      onSubmit={(data) => {
        imageUpload(data.profilePicture);
      }}
    >
      {(profilePicture) => (
        <FormikForm className="py-3 offset-md-3 col-md-6">
          {alert.show && (
            <div className={`alert alert-${alert.type} small`}>
              {alert.messages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )}
          <Form.Group>
            <FormFieldFile
              name="profilePicture"
              label={`Upload a profile picture`}
            />
          </Form.Group>
          <button
            disabled={isSubmitting}
            type="submit"
            className={`btn btn-primary btn-block`}
          >
            {isSubmitting ? (
              // prettier-ignore
              <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /><span className="sr-only">Loading...</span> </>
            ) : (
              "Upload"
            )}
          </button>
        </FormikForm>
      )}
    </Formik>
  );
};

const Dashboard = () => {
  const { userProfile } = useContext(AuthContext);

  return (
    <div className="container text-center py-4">
      <h1>Dashboard</h1>

      {userProfile ? (
        <div>
          Hello {userProfile.username}
          {!userProfile.profilePicture ? (
            <UploadProfilePicture />
          ) : (
            <div>
              <img
                src={userProfile.profilePicture}
                alt={userProfile.username}
              />
            </div>
          )}
        </div>
      ) : (
        <Spinner animation="grow" variant="primary" />
      )}
    </div>
  );
};

export default Dashboard;
