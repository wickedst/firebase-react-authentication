import React, { useState, useEffect } from "react";
import firebase from "../../../firebase";
import "firebase/firestore";

const Dashboard = () => {
  const [userName, setUserName] = useState();

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("Users")
      .doc(firebase.auth().currentUser!.uid)
      .get()
      .then((res) => {
        const user = res.data();
        if (user) {
          setUserName(user["username"]);
        }
      });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>
      <h2>Welcome to Dashboard!</h2>
      <h3>{userName}</h3>
    </div>
  );
};

export default Dashboard;
