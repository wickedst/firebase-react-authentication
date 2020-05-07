import React, { useContext, useState } from "react";
import { AuthContext } from "../../../AuthProvider";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Formik } from "formik";
import { Form as FormikForm } from "formik";
import FormFieldFile from "../../../components/FormFields/FormFieldFile";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import * as yup from "yup";

import uploadFile from "../../../utils/uploadFileToStorage";
import firebaseUpdateUser from "../../../utils/firebaseUpdateUser";
import firebaseGetAuth from "../../../utils/firebaseGetAuthId";

const schema = yup.object({
  profilePicture: yup
    .mixed()
    .required("A file is required")
    .test("fileFormat", "Please select a valid image type", (value) => {
      return value && value.type.includes("image/");
    })
    .test("fileSize", "Please upload an image under 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
});

const UploadProfilePicture = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { userProfile, setUserProfile, addToasts } = useContext(AuthContext);

  const auth = firebaseGetAuth();

  const imageUpload = (image: any) => {
    setIsSubmitting(true);

    const progressCallback = (res: number): void => {
      setUploadProgress(res);
    };

    auth
      ? // change to get auth
        uploadFile(auth.uid, image, progressCallback)
          .then((res) => {
            firebaseUpdateUser({ profilePicture: res }, auth.uid);
            // prettier-ignore
            setUserProfile( (profile: any) => (profile = { ...profile, ...{ profilePicture: res } }));
          })
          .then(() => {
            setIsSubmitting(false);
            setUploadProgress(0);
            // prettier-ignore
            addToasts((prevToasts: any) => [ ...prevToasts, { variant: "success", message: "Upload successful" }, ]);
          })
          .catch((err: any) => {
            // errorHandler
            setIsSubmitting(false);
            setUploadProgress(0);
            // prettier-ignore
            addToasts((prevToasts: any) => [ ...prevToasts, { variant: "danger", message: "Unauthorized or invalid file type" }, ]);
          })
      : console.log("You arent even logged in");
  };

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
          {/* <pre>{profilePicture.values.profilePicture}</pre> */}
          <Form.Row>
            <Form.Group as={Col} sm>
              <FormFieldFile
                name="profilePicture"
                label="Upload a profile picture"
              />
            </Form.Group>
            {profilePicture.values.profilePicture && (
              <Form.Group as={Col} sm={2}>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className={`btn btn-primary btn-block`}
                >
                  {isSubmitting ? (
                    // prettier-ignore
                    <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> <span className="sr-only">Loading...</span> </>
                  ) : (
                    // prettier-ignore
                    <> <img src="/upload.svg" alt="Upload" width={15} /> <span className="sr-only">Upload</span> </>
                  )}
                </button>
              </Form.Group>
            )}
          </Form.Row>
          {uploadProgress > 0 && <ProgressBar animated now={uploadProgress} />}
        </FormikForm>
      )}
    </Formik>
  );
};

const Dashboard = () => {
  const { userProfile } = useContext(AuthContext);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  return (
    <div className="container text-center py-4">
      <h1>Dashboard</h1>

      {userProfile ? (
        <div>
          Hello {userProfile.username}
          <UploadProfilePicture />
          {userProfile.profilePicture && (
            <div>
              <img
                src={userProfile.profilePicture}
                alt={userProfile.username}
                className="d-block w-50 mx-auto my-3"
              />
              <button
                className="btn btn-link-danger btn-sm"
                onClick={() => {
                  setShowUploadForm(true);
                }}
              >
                Change profile pic
              </button>
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
