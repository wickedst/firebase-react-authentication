import React from "react";
import ChangePassword from "./changePassword";
import Form from "react-bootstrap/Form";

const Account = () => {
  return (
    <div className="container py-4">
      <div className="offset-md-3 col-md-6">
        <h1>Account Settings</h1>
        <div className="card p-2 mb-3">
          <h2>Notifications</h2>
          <h4>Notification events</h4>
          <p className="text-muted">Notify me when...</p>
          <Form.Group>
            <Form.Check
              type="switch"
              id="notification-when-wall"
              label="Someone posts on my wall"
              checked
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              id="notification-when-like"
              label="Someone likes my profile"
            />
          </Form.Group>
          <h4>Notification types</h4>
          <p className="text-muted">Notify me how...</p>
          <Form.Group>
            <Form.Check
              type="switch"
              id="notification-type-tray"
              label="Tray notifications"
              checked
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              id="notification-type-email"
              label="Email"
              checked
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              id="notification-type-push"
              label="Push notifications (enable in this browser)"
            />
          </Form.Group>
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
