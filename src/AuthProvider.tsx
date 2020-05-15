import React, { useEffect, useState } from "react";
import firebase from "./firebase";
import "firebase/firestore";

type ContextProps = {
  user: firebase.User | null;
  userProfile: firebase.firestore.DocumentData | null;
  userPrivate: firebase.firestore.DocumentData | null;
  authenticated: boolean;
  setUser: any;
  setUserProfile: any;
  loadingAuthState: boolean;
  toasts: { message: string; variant: string }[];
  addToasts: any;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null as firebase.User | null);
  const [userProfile, setUserProfile] = useState(
    {} as firebase.firestore.DocumentData | null
  );
  const [userPrivate, setUserPrivate] = useState(
    {} as firebase.firestore.DocumentData | null
  );
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [toasts, addToasts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setUser(user);
      setLoadingAuthState(false);
      console.log(user, "ap user");
      console.log(user !== null, "ap authenticated");

      // Get user profile
      if (user !== null) {
        const db = firebase.firestore();
        // prettier-ignore
        db.collection("users").doc(firebase.auth().currentUser!.uid).get().then((res) => {
            const user = res.data();
            user ? setUserProfile(user) : setUserProfile(null)
          })
          .catch((error) => {
            console.log(error);
            setUserProfile(null);
          });
        // prettier-ignore
        db.collection("usersPrivate").doc(firebase.auth().currentUser!.uid).get().then((res) => {
            const user = res.data();
            user ? setUserPrivate(user) : setUserPrivate(null)
          })
          .catch((error) => {
            console.log(error);
            setUserProfile(null);
          });
      } else {
        console.log("Emptied user profile");
        setUserProfile(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authenticated: user !== null,
        userProfile,
        userPrivate,
        setUserProfile,
        loadingAuthState,
        toasts,
        addToasts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
