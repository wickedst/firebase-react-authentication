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

    console.log("[createWallNotification] Wall Message: ", wallMessageData);
    console.log("[createWallNotification] Context: ", context);

    // add rules - wall
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

    // if usersPrivate/${context.params.userID}/ dot notificationSettings - notificationWhenWall

    return myFunctions.createWallNotification(notification);
  });

export const cloudMessageNotification = functions.firestore
  .document("notifications/{docID}")
  .onCreate((snap, context) => {
    console.log("[cloudMessageNotification] Context: ", context);
    console.log("[cloudMessageNotification] Snap: ", snap.data());
    const notificationData = snap.data();

    const payload = {
      notification: {
        title: "Test title",
        body: `${notificationData?.message}`,
      },
    };
    return admin
      .messaging()
      .sendToTopic("News", payload)
      .then(function (response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function (error) {
        console.log("Notification sent failed:", error);
      });
  });
