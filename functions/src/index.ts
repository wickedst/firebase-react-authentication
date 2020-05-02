import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const checkUsername = functions.https.onCall((data: any, context) => {
  const username = data.username;

  const ref = admin.firestore().collection("Users");
  return ref
    .where("username", "==", username)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot.docs.length > 0) {
        return true;
      } else {
        return false;
      }
    });
});
