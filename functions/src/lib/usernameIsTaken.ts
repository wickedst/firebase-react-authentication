import { firestoreInstance } from "../index";

const usernameIsTaken = async (data: any) => {
  const username = data.username;
  firestoreInstance
    .collection("users")
    .where("username", "==", username)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot.docs.length > 0) {
        return true;
      } else {
        return false;
      }
    });
};

export default usernameIsTaken;
