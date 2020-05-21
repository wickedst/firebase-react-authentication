import { firestoreInstance } from "../index";
import { firestore } from "firebase-admin";

// createNewUserDoc - create user document server side
const createNewUserDocument = async (user: any) => {
  console.log(`Creating document for user ${user.uid}`);
  await firestoreInstance.collection("users").doc(user.uid).set({
    createdAt: firestore.FieldValue.serverTimestamp(),
    createdUsername: false,
    emailVerified: false,
    likes: 0,
  });
  await firestoreInstance
    .collection("usersPrivate")
    .doc(user.uid)
    .set({
      createdAt: firestore.FieldValue.serverTimestamp(),
      notificationSettings: {
        notificationWhenWall: true,
        notificationWhenLike: false,
        //
        notificationTypeDrawer: true,
        notificationTypeEmail: true,
        notificationTypePush: false,
      },
    });
};

export default createNewUserDocument;
