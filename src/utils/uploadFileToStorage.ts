import firebase from "firebase";

export default function uploadFile(
  storagePath: string,
  file: any,
  progressCallback: (progress: number) => void
) {
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef
      .child(`users/${storagePath}/${file.name}`)
      .put(file);

    console.log("Uploading?", file.name);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (typeof progressCallback === "function") {
          progressCallback(progress);
        }
      },
      // upload failure
      (error) => reject(error),
      // upload success
      () =>
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((fileUrl) => resolve(fileUrl))
          .catch((error) => reject(error))
    );
  });
}
