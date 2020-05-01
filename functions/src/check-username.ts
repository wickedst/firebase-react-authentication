const { admin, functions } = require("./admin");

exports.checkUsername = functions.https.onCall((data: string) => {
  const ref = admin.firestore().collection("Users").doc(data);
  return ref
    .get()
    .then((doc: { exists: any }) => {
      return { unique: !doc.exists };
    })
    .catch((err: string) => {
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to connect: " + err
      );
    });
});
