import * as functions from "firebase-functions";
import { tmpdir } from "os";
import * as sharp from "sharp";
import * as fs from "fs-extra";
import { dirname, join } from "path";

import * as storage from "@google-cloud/storage";
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

// Thumbnail generator
const gcs = new storage.Storage();
export const generateThumbs = functions.storage
  .object()
  .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    if (filePath) {
      const fileName = filePath?.split("/").pop();
      const bucketDir = dirname(filePath);

      const workingDir = join(tmpdir(), "thumbs");
      const tmpFilePath = join(workingDir, "source.png");

      if (
        fileName?.includes("thumb@") ||
        !object.contentType?.includes("image")
      ) {
        console.log("exiting function");
        return false;
      }

      // 1. Ensure thumbnail dir exists
      await fs.ensureDir(workingDir);

      // 2. Download Source File
      await bucket.file(filePath).download({
        destination: tmpFilePath,
      });

      // 3. Resize the images and define an array of upload promises
      const sizes = [64, 128, 256];

      const uploadPromises = sizes.map(async (size) => {
        const thumbName = `thumb@${size}_${fileName}`;
        const thumbPath = join(workingDir, thumbName);

        // Resize source image
        await sharp(tmpFilePath).resize(size, size).toFile(thumbPath);

        // Upload to GCS
        return bucket.upload(thumbPath, {
          destination: join(bucketDir, thumbName),
        });
      });

      // 4. Run the upload operations
      await Promise.all(uploadPromises);

      // 5. Cleanup remove the tmp/thumbs from the filesystem
      return fs.remove(workingDir);
    }
  });
