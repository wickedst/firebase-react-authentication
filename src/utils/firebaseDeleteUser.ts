import firebase from "firebase";
import { firestore } from "firebase";
const firebaseDeleteUser = async (password: string) => {
  return new Promise((resolve, reject) => {
    const usersRef = firestore().collection("users");
    const usersPrivateRef = firestore().collection("usersPrivate");
    const user = firebase.auth().currentUser;
    // re-authenticate user...
    if (user && user.email) {
      const cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      user
        .reauthenticateWithCredential(cred)
        .then(async () => {
          // ... then delete
          // deleting document from users will trigger a cloud function that creates a deletedUsers entry for record keeping
          await usersRef.doc(user.uid).delete();
          await usersPrivateRef.doc(user.uid).delete();
          user
            .delete()
            .then((res) => {
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default firebaseDeleteUser;
