import { tmpdir } from "os";
import * as sharp from "sharp";
import * as fs from "fs-extra";
import { dirname, join } from "path";
import * as storage from "@google-cloud/storage";
import { firestoreInstance } from "../index";

// Thumbnail generator
const sizes = [64, 128, 256];
const gcs = new storage.Storage();

export const generateThumbnails = async (object: any) => {
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

    // 5. If this upload is an avatar, attach the thumbnails to the users' document
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
            // console.log("signedUrl: ", signedUrl[0]);
            // For each of our sizes, loop through
            sizes.forEach((size) => {
              if (signedUrl[0].includes(`thumb%40${size}`)) {
                thumbsObj[size] = signedUrl[0];
              }
            });
          })
          .then(() => {
            // setUser thumbs
            firestoreInstance
              .collection("users")
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

    // 6. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  }
};

export default generateThumbnails;
