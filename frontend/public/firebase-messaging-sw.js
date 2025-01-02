importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js"
);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSbdZ0ERPP0_gmujVX0uIa0byga2h8dAo",
  authDomain: "caltrack-9b7b6.firebaseapp.com",
  projectId: "caltrack-9b7b6",
  storageBucket: "caltrack-9b7b6.firebasestorage.app",
  messagingSenderId: "859721676060",
  appId: "1:859721676060:web:b302b2f55dd942e7c8b6d9",
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "../src/assets/CalTrack-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
