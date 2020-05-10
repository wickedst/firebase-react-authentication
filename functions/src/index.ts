import * as functions from "firebase-functions";
import { tmpdir } from "os";
import * as sharp from "sharp";
import * as fs from "fs-extra";
import { dirname, join } from "path";
import * as storage from "@google-cloud/storage";

const admin = require("firebase-admin");
admin.initializeApp();

const usersRef = admin.firestore().collection("users");

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

const sizes = [64, 128, 256];

// Thumbnail generator
const gcs = new storage.Storage();

export const generateThumbs2 = functions.storage
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

      // 6. If this upload is a profilePicutre, attach the thumbnails to the users' document
      if (bucketDir.includes("avatar")) {
        const userUid = bucketDir.split("/")[1];

        const [buckets] = await gcs.getBuckets();
        // Just get the first / only bucket of the project. This can probably be improved
        const [files] = await gcs.bucket(buckets[0].name).getFiles({
          prefix: bucketDir,
        });

        let thumbsObj = {} as any;

        files.forEach((file) => {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then((signedUrl) => {
              console.log("signedUrl: ", signedUrl[0]);
              // For each of our sizes, loop through
              sizes.forEach((size) => {
                if (signedUrl[0].includes(`thumb%40${size}`)) {
                  thumbsObj[size] = signedUrl[0];
                }
              });
            })
            .then(() => {
              // setUser thumbs
              usersRef
                .doc(userUid)
                .update({
                  avatarThumbs: thumbsObj,
                })
                .then((res: any) => {
                  console.log(res);
                })
                .catch((error: any) => {
                  console.log(error);
                });
            });
        });
      }

      // 5. Cleanup remove the tmp/thumbs from the filesystem
      return fs.remove(workingDir);
    }
  });
