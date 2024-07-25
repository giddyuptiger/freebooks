// src/index.js
// import firebase from "firebase/app";
import { firebaseApp, firestoreDb } from "./firebaseUtils";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  checkAuthState,
  signOut,
  initializeAuthUI,
  logoutDiv,
  authContainer,
} from "./auth/auth";
import { liveInvoices } from "./database/invoice";
import { liveProjects, projectModal } from "./components/project";
import { startTimer, ticking, timer } from "./components/timer";
import {
  show,
  hide,
  div,
  elt,
  challengeBtn,
  // challengeAcceptedBtn,
  bulkDeleteBtn,
  editEntry,
  deleteEntry,
  invoiceBtn,
  invoiceProjectBtn,
  collectEntries,
  exportToCSV,
  submitHours,
  openTab,
} from "./commonFunctions";
import * as cF from "./commonFunctions";
import * as projectF from "./components/project";
import { close, enterHoursBtn, enterHoursModal } from "./components/hourEntry";

// // Initialize Firebase (add your config here)
// const firebaseConfig = {
//   apiKey: "<your-api-key>",
//   authDomain: "<your-auth-domain>",
//   databaseURL: "<your-database-url>",
//   projectId: "<your-project-id>",
//   storageBucket: "<your-storage-bucket>",
//   messagingSenderId: "<your-messaging-sender-id>",
//   appId: "<your-app-id>",
// };

// firebase.initializeApp(firebaseConfig);

let body = document.body;
body.append(logoutDiv);

const uid = "user-id"; // Replace with actual user ID logic
const userRef = `users/${uid}`;

checkAuthState();
liveInvoices(userRef);
liveProjects(userRef);
startTimer(userRef);
ticking();

// Define components
const navbar = div(
  { id: "navbar" },
  div(
    { id: "title" },
    elt("img", { src: "./FocusBooks Logo.png", width: "20" }),
    "FocusBooks"
  )
);

const bulkEditBtn = elt(
  "button",
  {
    id: "bulk-edit-btn",
    onclick: () => {
      show(bulkEditBtn);
    },
  },
  "Edit All Selected Entries"
);

function challengeAcceptedBtn() {
  console.log("Challenge Accepted!!");
  // hide(challengeModal);

  // const challengeInput = challengeTextArea.value;
  // challengebtn.innerHTML = challengeInput
  //   ? challengeInput
  //   : "What's the current challenge?";
  // activeChallenge = [challengeInput];
  // activeChallenges.push(challengeInput);
  // active
  //   ? db.ref(userRef + "/state").update({ challenges: activeChallenges })
  //   : console.log("not active");
  // console.log(activeChallenges);
}

const challengeModal = div(
  { id: "challenge-modal", class: "modal" },
  div(
    { class: "modal-content" },
    "Enter Challenge:",
    elt("textarea", {
      id: "challenge-input",
      name: "challenge-input",
      cols: "40",
      rows: "5",
    }),
    elt(
      "button",
      { id: "challenge-accepted-btn", onclick: challengeAcceptedBtn },
      "Let's do it!"
    )
  )
);

function submitBulkEdit() {
  console.log("submitBulkEdit");
  // const bulkEditKeys = {};
  // const pid = projectEdit.options[projectEdit.selectedIndex].value;
  // const checkboxes = document.querySelectorAll("input[type=checkbox]");
  // checkboxes.forEach((checkbox) => {
  //   const entrykey = checkbox.dataset.entrykey;
  //   if (checkbox.checked && entrykey) {
  //     // console.log(checkbox.dataset.entrykey);
  //     // console.log(bulkEditKeys, pid);
  //     const path = entrykey + "/pid";
  //     bulkEditKeys[path] = pid;
  //   }
  // });
  // console.log("updating:", bulkEditKeys);
  // //make object with only checked entries and their new pid
  // db.ref(userRef + "/uninvoiced").update(bulkEditKeys);
  // hide(bulkEditModal);
}

const projectEdit = elt("select", { name: "project-edit", id: "project-edit" });

const reportSection = div(
  { id: "report" },
  div(
    { class: "tab" },
    elt(
      "button",
      { class: "tablinks", onclick: openTab(event, "uninvoiced-tab") },
      "Time Sheet"
    ),
    elt(
      "button",
      { class: "tablinks", onclick: openTab(event, "invoices-tab") },
      "Invoices"
    )
  ),

  // Uninvoiced Tab
  div(
    { id: "uninvoiced-tab", class: "tabcontent" },
    bulkEditBtn,
    elt(
      "button",
      { id: "bulk-delete-btn", onclick: bulkDeleteBtn },
      "Delete All Selected Entries"
    ),
    div(
      { id: "bulk-edit-modal", class: "modal" },
      div(
        { class: "modal-content" },
        elt("span", { class: "close" }, " &times;"),
        "Edit All Selected Entries",
        div(
          { id: "bulk-edit-form" },
          elt("label", { for: "project-edit" }, "Project:"),
          projectEdit
        ),
        elt(
          "button",
          { id: "submit-bulk-edit", onclick: submitBulkEdit },
          "Submit"
        )
      )
    ),
    div({ id: "hours-table" })
  ),
  // Invoices Tab
  div(
    { id: "invoices-tab", class: "tabcontent" },
    div({ id: "invoices-table" })
  ),

  // Invoice Modal
  div(
    { id: "invoice-modal", class: "modal" },
    div(
      { class: "modal-content" },
      "Select a project to invoice:",
      elt("label", { for: "project-to-invoice" }, "Project"),
      elt("select", { name: "project", id: "project-to-invoice" }),
      elt(
        "button",
        { id: "invoice-project-btn", onclick: invoiceProjectBtn },
        "Invoice"
      )
    )
  )
);

// Assemble the main structure
let mainStructure = div(
  {},
  navbar,
  authContainer,
  elt(
    "button",
    { id: "projectbtn", onclick: projectF.projectBtn },
    "Select Project"
  ),
  timer,
  elt(
    "button",
    { id: "challenge-btn", onclick: challengeBtn },
    "What's the current challenge?"
  ),
  challengeModal,
  div(
    { id: "bottombar" },
    elt(
      "button",
      { id: "enterHoursBtn", onlclick: enterHoursBtn },
      "Enter Time"
    ),
    enterHoursModal,
    elt("button", { id: "invoicebtn", onclick: invoicebtn }, "Invoice")
  ),
  projectModal,
  elt(
    "button",
    { id: "my-time", onclick: openReporting },
    "Toggle Reporting View"
  ),
  reportSection
);

// Append the main structure to the body or a specific container
document.body.appendChild(mainStructure);
console.log(mainStructure);

// function openReporting() {
//   (reportSection.style.display || report_Style_Display) === "none"
//     ? show(reportSection)
//     : hide(reportSection);
// }

// export function challengeModal() {
//   console.log("opening challenge modal");

//   document.getElementById("challenge-input").value = "";
//   show(challengeModal);

//   challengeTextArea.addEventListener("keyup", function (event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 13) {
//       // Cancel the default action, if needed
//       event.preventDefault();
//       // Trigger the button element with a click
//       challengeAcceptedbtn.click();
//     }
//   });
// }
