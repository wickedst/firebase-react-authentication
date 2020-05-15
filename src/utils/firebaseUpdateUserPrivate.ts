import firebase from "firebase";

const firebaseUpdateUserPrivate = (payload: any, uid: string) => {
  return new Promise((resolve, reject) => {
    const usersRef = firebase.firestore().collection("usersPrivate");
    usersRef
      .doc(uid)
      .update(payload)
      .then((res) => resolve(res))
      .catch((error: any) => reject(error));
  });
};

export default firebaseUpdateUserPrivate;
