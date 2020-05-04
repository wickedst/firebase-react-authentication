import firebase from "firebase";

const usersRef = firebase.firestore().collection("users");

const firebaseUpdateUser = (payload: {}, uid: string) => {
  usersRef
    .where("uid", "==", uid)
    .get()
    .then((snapshot) => {
      snapshot.forEach(function (doc) {
        usersRef.doc(doc.id).update(payload);
      });
    })
    .catch((error: any) => error);
};

export default firebaseUpdateUser;
