import React from "react";
import ChangePassword from "./changePassword";
import NotificationSettings from "./notificationSettings";

const Account = () => {
  return (
    <div className="container py-4">
      <div className="offset-md-3 col-md-6">
        <h1>Account Settings</h1>
        <div className="card p-2 mb-3">
          <h2>Notifications</h2>
          <NotificationSettings />
        </div>
        <div className="card p-2">
          <h2>Change Password</h2>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default Account;
