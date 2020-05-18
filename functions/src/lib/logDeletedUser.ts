import { firestoreInstance } from "../index";
import { firestore } from "firebase-admin";

const logDeletedUser = (
  deletedData: FirebaseFirestore.DocumentData,
  context: any
) => {
  // data on deleted users we want to keep
  return firestoreInstance
    .collection("deletedUsers")
    .doc(context.params.userID)
    .set({
      // deletedOn,
      // email, // from context
      createdAt: deletedData?.createdAt, // from collection
      deletedAt: firestore.FieldValue.serverTimestamp(),
      usernameWas: deletedData?.username,
      likesWas: deletedData?.likes,
    });
};

export default logDeletedUser;
