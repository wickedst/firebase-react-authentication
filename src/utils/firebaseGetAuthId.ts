import firebase from "firebase";

function firebaseGetAuth(): firebase.User | null {
  return firebase.auth().currentUser;
}

export default firebaseGetAuth;
