import React, { useContext } from "react";
import ChangePassword from "./changePassword";
import NotificationSettings from "./notificationSettings";
import { AuthContext } from "../../../AuthProvider";
import DeleteAccount from "./deleteAccount";

const Account = () => {
  const { userPrivate } = useContext(AuthContext);

  return (
    <div className="container py-4">
      <div className="offset-md-3 col-md-6">
        <h1>Account Settings</h1>
        <div className="card p-2 mb-3">
          <h2>Notifications</h2>

          {userPrivate ? (
            <NotificationSettings
              notificationSettings={userPrivate.notificationSettings}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="card p-2 mb-3">
          <h2>Change Password</h2>
          <ChangePassword />
        </div>
        <div className="card p-2">
          <h2>Delete account</h2>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default Account;
