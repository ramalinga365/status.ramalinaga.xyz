import "../styles/globals.css";
import {
  NotificationProvider,
  NotificationContext,
} from "../components/Notification";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <NotificationContext.Provider
      value={{ addNotification, removeNotification }}
    >
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </NotificationContext.Provider>
  );
}

export default MyApp;
