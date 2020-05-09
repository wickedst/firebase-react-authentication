import React, { useEffect, useContext } from "react";
import firebase from "firebase";
import { AuthContext } from "../../../AuthProvider";

const Home = () => {
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (userProfile) {
      let thumbs = {} as any;
      const storageRef = firebase
        .storage()
        .ref(`users/${userProfile.uid}/profilePicture/`);

      storageRef
        .listAll()
        .then(function (result) {
          const sizes = [64, 128, 256];

          result.items.forEach(function (imageRef) {
            imageRef.getDownloadURL().then(function (url: string) {
              sizes.forEach((size) => {
                if (url.includes(`thumb%40${size}`)) {
                  console.log(url);
                  thumbs[size] = url;
                }
              });
            });
          });
          console.log(thumbs);
        })

        .then(() => {
          console.log(thumbs);
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
