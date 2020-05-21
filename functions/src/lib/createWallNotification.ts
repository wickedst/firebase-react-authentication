import { firestoreInstance } from "../index";

// createNewUserDoc - create user document server side
const createWallNotification = async (notification: any) => {
  await firestoreInstance.collection("notifications").doc().set(notification);
};

export default createWallNotification;
