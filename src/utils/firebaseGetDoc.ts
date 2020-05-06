import firebase from "firebase";

const firebaseGetDoc = (collection: string, doc: string) => {
  const docRef = firebase.firestore().collection(collection);

  return new Promise((resolve, reject) => {
    docRef
      .doc(doc)
      .collection("messages")
      .get()
      .then((res) => {
        resolve(res);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export default firebaseGetDoc;
