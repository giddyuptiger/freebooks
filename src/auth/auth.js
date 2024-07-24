import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import { firebaseConfig } from "../firebaseUtils";

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

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      show(signin);
      show(authContainer);
      hide(timer);
      hours.innerHTML = "";
      console.log("logged out");
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function checkAuthState() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      authContainer.style.display = "none";
      console.log(user.email, "logged in");
      uid = user.uid;
      userRef = "users/" + uid;
      hide(signin);
      // logout.style.display = "block";
      show(logout);
      liveProjects();
      liveHours();
      liveInvoices();
      db.ref(userRef + "/state").on("value", function (snapshot) {
        try {
          // console.log("trying to read /state");
          active = snapshot.val().active;
          activepid = snapshot.val().pid;
          starttime = snapshot.val().starttime;
          console.log("activePid: ", activepid);
          // console.log("PROJECTactive: ", projectObj[activepid]);
          // console.log("PROJECTactive: ", projectObj[activepid].projectName);
          activeProject = projectObj[activepid].projectName;
          activeChallenges = snapshot.val().challenges
            ? snapshot.val().challenges
            : [];
          // activeClient = snapshot.val().client;
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
          starttime = snapshot.val().starttime;
        } catch (err) {
          console.log("couldn't reach active, creating it now...", err);
          db.ref(userRef + "/state").set({ active: false });
        }
      });
      show(timer);
      show(projectbtn);
    } else {
      // No user is signed in.
      // signin.style.display = "block";
      hide(logout);
      show(signin);
      show(authContainer);
      hide(timer);
      hide(projectbtn);
      console.log("no user logged in");
    }
  });
}
