/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyDYzXY_wgENbfgbSGF9gUyLiaa4e4JDkN0",
  authDomain: "fir-react-ts-starter.firebaseapp.com",
  databaseURL: "https://fir-react-ts-starter.firebaseio.com",
  projectId: "fir-react-ts-starter",
  storageBucket: "fir-react-ts-starter.appspot.com",
  messagingSenderId: "433801999183",
  appId: "1:433801999183:web:592584b17f244072944b3a",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const {
    data: { title, body },
  } = payload;
  // Customize notification here
  const notificationTitle = title;
  const notificationOptions = {
    body: body,
    icon: "/logo192.png",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
