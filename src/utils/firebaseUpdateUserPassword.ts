import firebase from "firebase";

export const firebaseUpdateUserPassword = (
  currentPassword: string,
  newPassword: string
) => {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (user && user.email) {
      const cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      user
        .reauthenticateWithCredential(cred)
        .then(() => {
          user.updatePassword(newPassword);
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => reject(error));
    }
  });
};
