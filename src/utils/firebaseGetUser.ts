import firebase from "firebase";

const usersRef = firebase.firestore().collection("users");

const firebaseGetUser = (doc: string) => {
  return new Promise((resolve, reject) => {
    usersRef
      .doc(doc)
      .get()
      .then((res) => {
        resolve(res.data());
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export default firebaseGetUser;
