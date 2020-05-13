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
import firebaseGetAuth from "../../../utils/firebaseGetAuth";
import CreateUsername from "./createUsername";

const schema = yup.object({
  avatar: yup
    .mixed()
    .required("A file is required")
    .test("fileFormat", "Please select a valid image type", (value) => {
      return value && value.type.includes("image/");
    })
    .test("fileSize", "Please upload an image under 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
});

const Uploadavatar = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { setUserProfile, addToasts } = useContext(AuthContext);

  const auth = firebaseGetAuth();

  const imageUpload = (image: any) => {
    setIsSubmitting(true);

    const progressCallback = (res: number): void => {
      setUploadProgress(res);
    };

    auth
      ? // change to get auth
        uploadFile(`users/${auth.uid}/avatar/`, image, progressCallback)
          .then((res) => {
            //@ts-ignore
            firebaseUpdateUser({ avatarFull: res }, auth.uid);
            // prettier-ignore
            setUserProfile( (profile: any) => (profile = { ...profile, ...{ avatarFull: res } }));
          })
          .then(() => {
            setIsSubmitting(false);
            setUploadProgress(0);
            // prettier-ignore
            addToasts((prevToasts: any) => [ ...prevToasts, { variant: "success", message: "Upload successful" }, ]);
          })
          .catch((err: any) => {
            // errorHandler
            console.log(err);
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
        avatar: "",
      }}
      onSubmit={(data) => {
        imageUpload(data.avatar);
      }}
    >
      {(avatar) => (
        <FormikForm className="py-3 offset-md-3 col-md-6">
          {/* <pre>{avatar.values.avatar}</pre> */}
          <Form.Row>
            <Form.Group as={Col} sm>
              <FormFieldFile name="avatar" label="Upload a profile picture" />
            </Form.Group>
            {avatar.values.avatar && (
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

  return (
    <div className="container text-center py-4">
      {!userProfile?.createdUsername ? (
        <CreateUsername />
      ) : (
        <div>
          {userProfile.avatarFull && (
            <div>
              <img
                src={
                  userProfile.avatarThumbs
                    ? userProfile.avatarThumbs["256"]
                    : userProfile.avatarFull
                }
                alt={userProfile.username}
                className="d-block mx-auto my-3"
                style={{ maxWidth: 128 }}
              />
            </div>
          )}
          Hello {userProfile.username}
          <Uploadavatar />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
