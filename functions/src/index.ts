import * as functions from "firebase-functions";
import { tmpdir } from "os";
import * as sharp from "sharp";
import * as fs from "fs-extra";
import { dirname, join } from "path";
import * as storage from "@google-cloud/storage";
import slugify from "slugify";
// import * as yup from "yup";

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

// const schema = yup.object({
//   username: yup
//     .string()
//     .required()
//     .min(3)
//     .max(15)
//     .matches(
//       /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
//       "Can not contain spaces or special characters"
//     ),
// });

// unique username checker
export const createUsername = functions.https.onCall(
  async (data: any, context) => {
    const username = data.username;

    // if (await schema.validate(username)) {
    //   return new Error();
    // }
    // try {
    //   await schema.validate(username, { abortEarly: false });
    // } catch (err) {
    //   return formatYupError(err);
    // }

    if (context.auth) {
      const uid = context.auth.uid;
      console.log(`Request create username '${username}' for user ${uid}`);

      const usernameSlug = slugify(username, {
        remove: /[$*+~.,()'"!\-:@]/g,
        lower: true,
      });
      //
      const userHasUsername = async (uid: string): Promise<boolean> => {
        console.log(`Checking if user ${uid} already has a username`);
        return await usersRef
          .doc(uid)
          .get()
          .then((doc: any) => {
            const username = doc.data().username;
            if (username) {
              console.log("Has username, ", username);
              return true;
            } else {
              console.log("User does not have username, proceed...");
              return false;
            }
          });
      };

      // convert to util 'dataExists'
      const requestedUsernameIsUnique = async (
        username: string
      ): Promise<boolean> => {
        console.log(
          `Checking if requested username (${username}) is available`
        );
        return await usersRef
          .where("username", "==", username)
          .get()
          .then((querySnapshot: any) => {
            if (querySnapshot.docs.length > 0) {
              console.log(`Found existing username for ${username}`);
              return false;
            } else {
              console.log(`No existing username for ${username}`);
              return true;
            }
          })
          .catch((err: any) => console.log(err));
      };

      const setUsername = async (
        username: string,
        uid: string
      ): Promise<void> => {
        console.log(`Setting username ${username} for user ${uid}`);
        return await usersRef.doc(uid).update({
          username,
          createdUsername: true,
          slug: usernameSlug,
        });
      };

      if (
        (await userHasUsername(uid)) === false &&
        (await requestedUsernameIsUnique(username)) === true
      ) {
        console.log(`create username '${username}' for user ${uid}`);
        await setUsername(username, uid);
        return true;
      } else {
        console.log("Could not create username");
        return false;
      }

      // if no auth for some obscure reason, thanks Typescript
    } else {
      console.log("Something else didn't work");
      return false;
    }
  }
);

// createNewUserDoc - create user document server side
export const createNewUserDoc = functions.auth.user().onCreate(async (user) => {
  console.log(`Creating document for user ${user.uid}`);
  await usersRef.doc(user.uid).set({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdUsername: false,
    emailVerified: false,
    likes: 0,
  });
});

// uniqueUsername - Create username record in 'usernames' collection
// export const uniqueUsername = functions.firestore
//   .document("usernames/{document}")
//   .onCreate(async (sppDoc: any, context) => {
//     const docId = context.params.document; // this is how to get the document name
//     console.log(docId);
//     // console.log(usernameSlug);
//     const data = sppDoc.data();
//     console.log(data); // the user defined fields:values
//     const usernameSlug = slugify(data.username, {
//       remove: /[$*+~.,()'"!\-:@]/g,
//       lower: true,
//     });
//     // don't write if there's already a username
//     await usersRef
//       .doc(docId)
//       .get()
//       .then((doc: { data: () => any }) => {
//         const user = doc.data();
//         if (user.username && user.slug) {
//           console.log("Already have username / slug");
//           return;
//         }
//       });
//     // write username if no username
//     await usersRef.doc(docId).update({
//       username: data.username,
//       slug: usernameSlug,
//     });
//   });

// Thumbnail generator
const sizes = [64, 128, 256];
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

      // 6. Cleanup remove the tmp/thumbs from the filesystem
      return fs.remove(workingDir);
    }
  });
