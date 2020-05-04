import firebase from "firebase";

function firebaseGetAuthId(): string {
  //@ts-ignore
  return firebase.auth().currentUser.uid;
}

export default firebaseGetAuthId;
