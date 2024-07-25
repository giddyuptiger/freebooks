import { firebaseApp, firestoreDb } from "../firebaseUtils"; // Import Firebase app and Firestore
import "firebase/auth"; // Import Firebase Auth
import * as firebaseui from "firebaseui";
import { show, hide } from "../commonFunctions";
import { div } from "../commonFunctions";

export const logoutDiv = div(
  { id: "logoutbtn", onclick: signOut() },
  "Log Out"
);

const authContainer = div(
  { id: "auth-container", class: "modal" },
  div(
    { id: "firebaseui-auth-container", class: "modal-content" },
    div({ id: "tagline" }, "Sign Up Free. Use Free. Forever.")
  )
);

// Initialize FirebaseUI
export function initializeAuthUI() {
  let ui = new firebaseui.auth.AuthUI(firebase.auth());
  console.log(ui);
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

// Sign out function
export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // show(signin);
      show(authContainer);
      // hide(timer);
      // hours.innerHTML = "";
      console.log("logged out");
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Check authentication state
export function checkAuthState() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      authContainer.style.display = "none";
      console.log(user.email, "logged in");
      uid = user.uid;
      userRef = "users/" + uid;
      // hide(signin);
      show(logoutDiv);
      liveProjects();
      liveHours();
      liveInvoices();
      db.ref(userRef + "/state").on("value", function (snapshot) {
        try {
          active = snapshot.val().active;
          activepid = snapshot.val().pid;
          starttime = snapshot.val().starttime;
          console.log("activePid: ", activepid);
          activeProject = projectObj[activepid].projectName;
          activeChallenges = snapshot.val().challenges || [];
          console.log(
            "Updating state to:",
            "\npid: ",
            activepid,
            "\nProject: ",
            activeProject,
            "\nClient: ",
            activeClient,
            "\nActive?:",
            active
          );
          projectbtn.innerHTML = activeProject
            ? "Project: " + activeProject
            : "Select Project...";
          active
            ? projectbtn.classList.add("inactive")
            : projectbtn.classList.remove("inactive");
        } catch (err) {
          console.log("couldn't reach active, creating it now...", err);
          db.ref(userRef + "/state").set({ active: false });
        }
      });
      // show(timer);
      // show(projectbtn);
    } else {
      hide(logoutDiv);
      // show(signin);
      show(authContainer);
      // hide(timer);
      // hide(projectbtn);
      console.log("no user logged in");
    }
  });
}
