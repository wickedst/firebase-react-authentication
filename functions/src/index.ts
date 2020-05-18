import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// import slugify from "slugify";
// import * as yup from "yup";
// import { ValidationError } from "yup";

import * as myFunctions from "./lib/index";
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
