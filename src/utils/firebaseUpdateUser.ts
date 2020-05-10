import firebase from "firebase";

const usersRef = firebase.firestore().collection("users");

const firebaseUpdateUser = (payload: any, uid: string) => {
  usersRef
    .doc(uid)
    .update(payload)
    .catch((error: any) => error);
};

export default firebaseUpdateUser;
