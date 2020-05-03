import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();

const usersRef = admin.firestore().collection("users");

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const usernameIsTaken = functions.https.onCall((data: any) => {
  const username = data.username;

  return usersRef
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

// is this secure?
export const setUser = functions.https.onCall((data: any) => {
  const { email, username, uid } = data;

  usersRef
    .doc(uid)
    .set({
      email: email,
      username: username,
    })
    .then((res: any) => res)
    .catch((error: any) => error);
});

// is this secure?
export const updateUser = functions.https.onCall((data: any) => {
  const { payload, uid } = data;

  usersRef
    .doc(uid)
    .update({
      ...payload,
    })
    .then((res: any) => res)
    .catch((error: any) => error);
});
