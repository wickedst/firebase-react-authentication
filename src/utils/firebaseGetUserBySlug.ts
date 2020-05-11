import firebase from "firebase";

const usersRef = firebase.firestore().collection("users");

const firebaseGetUserBySlug = (slug: string) => {
  return new Promise((resolve, reject) => {
    usersRef
      .where("slug", "==", slug)
      .get()
      .then((querySnapshot: any) => {
        if (querySnapshot.docs.length === 1) {
          querySnapshot.forEach(function (doc: any) {
            resolve(doc.data());
          });
        } else {
          reject("Something went wrong");
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export default firebaseGetUserBySlug;
