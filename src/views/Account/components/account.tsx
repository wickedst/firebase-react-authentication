import React from "react";
import ChangePassword from "./changePassword";

const Account = () => {
  return (
    <div className="container py-4 text-center">
      <h1>Account Settings</h1>
      <h2>Notification settings</h2>
      <h2>Change Password</h2>
      <ChangePassword />
    </div>
  );
};

export default Account;
