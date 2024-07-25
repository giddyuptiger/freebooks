// src/auth/authUI.js
import firebase from "firebase/app";
import "firebase/auth"; // Import Firebase Auth
import firebaseui from "firebaseui"; // Import Firebase UI

export function initializeAuthUI() {
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start("#firebaseui-auth-container", {
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        return false;
      },
      uiShown: function () {
        document.getElementById("loader").style.display = "none";
      },
    },
    signInFlow: "popup",
    tosUrl: "<your-tos-url>",
    privacyPolicyUrl: "<your-privacy-policy-url>",
  });
}
