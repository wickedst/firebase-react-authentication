import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import * as myFunctions from "./lib/index";
import { firestore } from "firebase-admin";

admin.initializeApp();
export const firestoreInstance = admin.firestore();

export const logDeletedUser = functions.firestore
  .document("users/{userID}")
  .onDelete((snap, context) => {
    const deletedData = snap.data();
    return myFunctions.logDeletedUser(deletedData!, context);
  });

export const generateThumbnails = functions.storage
  .object()
  .onFinalize(async (object) => {
    return myFunctions.generateThumbnails(object);
  });

export const usernameIsTaken = functions.https.onCall((data: any) => {
  return myFunctions.usernameIsTaken1(data);
});

export const createUsername = functions.https.onCall((data: any, context) => {
  return myFunctions.createUsername(data, context);
});

export const createNewUserDoc = functions.auth.user().onCreate(async (user) => {
  console.log(`Creating document for user ${user.uid}`);
  return myFunctions.createNewUserDoc(user);
});

export const createWallNotification = functions.firestore
  .document("walls/{userID}/messages/{docID}")
  .onCreate((snap, context) => {
    const wallMessageData = snap.data();

    console.log("Wall Message: ", wallMessageData);
    console.log("Context: ", context);

    // add rule - wall
    if (context.params.userID === wallMessageData?.user.uid) {
      console.log("same user, not creating notification");
      return null;
    }

    const notification = {
      to: context.params.userID,
      read: false,
      timestamp: firestore.FieldValue.serverTimestamp(),
      type: "wall",
      message: wallMessageData?.message ? wallMessageData.message : null,
      user: {
        uid: wallMessageData?.user.uid ? wallMessageData.user.uid : null,
        username: wallMessageData?.user.username,
        slug: wallMessageData?.user.slug,
        avatar: wallMessageData?.user.avatar
          ? wallMessageData.user.avatar
          : null,
      },
    };

    return myFunctions.createWallNotification(notification);
  });
