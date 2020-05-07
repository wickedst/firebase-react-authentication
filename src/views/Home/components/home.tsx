import React, { useEffect, useContext } from "react";
import firebase from "firebase";
import { AuthContext } from "../../../AuthProvider";

function displayImage(imageRef: firebase.storage.Reference): void {
  imageRef
    .getDownloadURL()
    .then(function (url) {
      console.log(url);
      // TODO: Display the image on the UI
    })
    .catch(function (error) {
      // Handle any errors
    });
}
const Home = () => {
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (userProfile) {
      const storageRef = firebase.storage().ref(`users/${userProfile.uid}/`);

      storageRef
        .listAll()
        .then(function (result) {
          result.items.forEach(function (imageRef) {
            console.log("imageRef ", imageRef);
            displayImage(imageRef);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [userProfile]);
  return (
    <div className="text-center container py-4">
      <h1>Homepage</h1>
    </div>
  );
};

export default Home;
