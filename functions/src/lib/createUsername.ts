import slugify from "slugify";
import * as yup from "yup";
import { ValidationError } from "yup";
import { firestoreInstance } from "../index";

const schema = yup.object({
  username: yup
    .string()
    .required()
    .min(3)
    .max(15)
    .matches(
      /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
      "Can not contain spaces or special characters"
    ),
});
const formatYupError = (err: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};

const createUsername = async (data: any, context: any) => {
  const username = data.username;

  try {
    await schema.validate({ username: data.username }, { abortEarly: false });
  } catch (err) {
    return formatYupError(err);
  }

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
      return await firestoreInstance
        .collection("users")
        .doc(uid)
        .get()
        .then((doc: any) => {
          if (doc.data().username) {
            console.log("Has username");
            return true;
          } else if (!doc.data().username) {
            console.log("User does not have username, proceed...");
            return false;
          } else {
            console.log("User does not have username, proceed...");
            return false;
          }
        });
    };

    // convert to util 'dataExists'
    const requestedUsernameIsUnique = async (username: string) => {
      console.log(`Checking if requested username (${username}) is available`);
      return await firestoreInstance
        .collection("users")
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

    const setUsername = async (username: string, uid: string) => {
      console.log(`Setting username ${username} for user ${uid}`);
      return await firestoreInstance.collection("users").doc(uid).update({
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
};

export default createUsername;
