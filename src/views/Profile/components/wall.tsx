import React, { useEffect, useState } from "react";
import firebase from "firebase";
import FormWallMessage from "../../../components/Forms/FormWallMessage";
import firebaseGetAuth from "../../../utils/firebaseGetAuth";
import { formatDistanceToNowStrict } from "date-fns";
import sortBy from "lodash.sortby";

export interface WallMessage {
  timestamp: number;
  message: string;
  user: {
    username: string;
    slug: string;
    uid: string;
    avatar: string | null;
  };
}

const Wall = (props: any) => {
  const [wallMessages, setWallMessages] = useState<WallMessage[]>([]);

  const wallsRef = firebase
    .firestore()
    .collection("walls")
    .doc(props.profile.slug) // change to uid
    .collection("messages");

  useEffect(() => {
    wallsRef
      .orderBy("timestamp")
      .get()
      .then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
          let message = doc.data();
          setWallMessages((prevWallPosts: any) => [...prevWallPosts, message]);
        });
      })
      .catch((err) => console.log(err));
  }, [props.profile.slug, wallsRef]);

  const messageAddHandler = (message: any) => {
    // firebaseAddWallMessage
    wallsRef
      .add(message)
      .then(() => {
        console.log("added message?");
        setWallMessages((prevWallPosts: any) => [...prevWallPosts, message]);
      })
      .catch((error) => {
        console.log(error.message);
        // toast
      });
  };

  const WallMessages = () => {
    const sortedMessages = sortBy(wallMessages, "timestamp").reverse();

    return (
      <div className="text-left py-3">
        {sortedMessages.map((message: any, index: number) => {
          return (
            <div key={index} className="mb-1">
              <div className="small">
                {message.user.username}
                {" - "}
                <span className="text-muted">
                  {formatDistanceToNowStrict(message.timestamp, {
                    addSuffix: true,
                  })}
                </span>
              </div>
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
