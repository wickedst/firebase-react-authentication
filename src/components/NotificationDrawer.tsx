import React, { useEffect, useContext } from "react";
import firebase from "../firebase";
import Dropdown from "react-bootstrap/Dropdown";
import { AuthContext } from "../AuthProvider";

const NotificationDrawer = () => {
  const { notifications } = useContext(AuthContext);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  const Items = () => {};

  return (
    <Dropdown alignRight>
      <Dropdown.Toggle variant="dark" id="dropdown-notifications">
        {notifications && notifications.length > 0 ? (
          <span
            className="bg-danger rounded-circle position-absolute"
            style={{
              right: 8,
              width: 15,
              height: 15,
              lineHeight: "18px",
              fontSize: 10,
            }}
          >
            {notifications.length}
          </span>
        ) : null}
        <img src="/bell_white.svg" alt="Notifications" width={23} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="small" style={{ width: 400, height: 250 }}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => {
            return (
              <Dropdown.Item
                key={index}
                className="small"
                style={{ whiteSpace: "normal" }}
              >
                {notification.message}
              </Dropdown.Item>
            );
            // return <li key={index}>{notification.message}</li>;
          })
        ) : (
          <div className="d-flex h-100 align-items-center justify-content-center">
            <p className="text-muted small">No notifications found</p>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDrawer;
