import React, { useEffect, useState } from "react";
import firebase from "firebase";
import FormWallMessage from "../../../components/Forms/FormWallMessage";
import firebaseGetAuth from "../../../utils/firebaseGetAuthId";
import { timeAgo } from "../../../utils/general";

export interface WallMessage {
  timestamp: number;
  message: string;
  user: {
    username: string;
    slug: string;
    uid: string;
    profilePicture: string;
  };
}

const wallsRef = firebase.firestore().collection("walls");

const Wall = (props: any) => {
  const [wallMessages, setWallMessages] = useState<WallMessage[]>([]);

  useEffect(() => {
    wallsRef
      .doc(props.profile.slug)
      .collection("messages")
      .orderBy("timestamp")
      .get()
      .then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
          let message = doc.data();
          setWallMessages((prevWallPosts: any) => [...prevWallPosts, message]);
        });
      })
      .catch((err) => console.log(err));
  }, [props.profile.slug]);

  const messageAddHandler = (message: any) => {
    // firebaseAddWallMessage
    wallsRef
      .doc(props.profile.slug)
      .collection("messages")
      .add(message)
      .then(() => {
        console.log("added message?");
        setWallMessages((prevWallPosts: any) => [...prevWallPosts, message]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const WallMessages = () => {
    return (
      <div className="text-left py-3">
        {wallMessages.map((message, index) => {
          return (
            <div key={index} className="mb-1">
              <div className="small text-muted">{message.timestamp}</div>
              {message.message}
            </div>
          );
        })}
        <hr className="mb-0" />
      </div>
    );
  };

  return (
    <div className="text-center container p-3 border">
      <h2>{props.profile.username} wall</h2>
      {!wallMessages ? (
        <p>This user doesn't have any wall posts</p>
      ) : (
        <WallMessages />
      )}

      {firebaseGetAuth() && (
        <FormWallMessage onAddMessage={messageAddHandler} />
      )}
    </div>
  );
};

export default Wall;
