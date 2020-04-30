import React, { useContext } from "react";
import { AuthContext } from "../../../AuthProvider";
import Spinner from "react-bootstrap/Spinner";

const Dashboard = () => {
  const { userProfile } = useContext(AuthContext);

  return (
    <div className="container text-center py-4">
      <h1>Dashboard</h1>

      {userProfile ? (
        userProfile.username
      ) : (
        <Spinner animation="grow" variant="primary" />
      )}
    </div>
  );
};

export default Dashboard;
