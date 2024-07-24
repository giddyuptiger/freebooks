// src/index.js
// import firebase from "firebase/app";
import { firebaseConfig, db } from "./firebaseUtils";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { checkAuthState, signOut, initializeAuthUI } from "./auth/auth";
import { liveInvoices } from "./database/invoice";
import { liveProjects } from "./components/project";
import { startTimer, ticking } from "./components/timer";
import {
  show,
  hide,
  div,
  elt,
  challengeBtn,
  challengeAcceptedBtn,
  bulkDeleteBtn,
  submitBulkEdit,
  editEntry,
  deleteEntry,
  invoiceBtn,
  invoiceProjectBtn,
  collectEntries,
  exportToCSV,
  submitHours,
} from "./commonFunctions";
import { cF } from "./commonFunctions";
import * as projectF from "./components/project";
import { close, enterHoursBtn } from "./components/hourEntry";

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

firebase.initializeApp(firebaseConfig);
initializeAuthUI();

let body = document.body;
const logoutDiv = div({ id: "logoutbtn", onclick: f.logout() }, "Log Out");
body.append(logoutDiv);

const uid = "user-id"; // Replace with actual user ID logic
const userRef = `users/${uid}`;

checkAuthState();
liveInvoices(userRef);
liveProjects(userRef);
startTimer(userRef);
ticking();

// Define components
const navbar = div({ id: "navbar" }, [
  div({ id: "title" }, [
    elt("img", { src: "./FocusBooks Logo.png", width: "20" }),
    "FocusBooks",
  ]),
]);

const authContainer = div({ id: "auth-container", class: "modal" }, [
  div({ id: "firebaseui-auth-container", class: "modal-content" }, [
    div({ id: "tagline" }, "Sign Up Free. Use Free. Forever."),
  ]),
]);

const challengeModal = div({ id: "challenge-modal", class: "modal" }, [
  div({ class: "modal-content" }, [
    "Enter Challenge:",
    elt("textarea", {
      id: "challenge-input",
      name: "challenge-input",
      cols: "40",
      rows: "5",
    }),
    elt(
      "button",
      { id: "challenge-accepted-btn", onclick: challengeAcceptedBtn() },
      "Let's do it!"
    ),
  ]),
]);

const enterHoursModal = div({ id: "enterhours", class: "modal" }, [
  div({ class: "modal-content" }, [
    elt("span", { class: "close", onclick: close() }, " &times;"),
    elt("h1", { id: "enter-title" }, "Enter Time"),
    elt("h1", { id: "edit-title" }, "Edit Entry"),
    elt("label", { for: "hoursentry" }, "Hours"),
    elt("input", { type: "text", id: "hoursentry", name: "hours" }),
    elt("label", { for: "dateentry" }, "Date:"),
    elt("input", {
      type: "date",
      id: "dateentry",
      name: "date",
      min: "2020-01-01",
    }),
    elt("label", { for: "projectentry" }, "Project"),
    elt("select", { name: "project", id: "projectentry" }),
    elt("input", { type: "text", id: "key" }),
    elt("button", { id: "submit", onclick: submitHours() }, "Submit"),
  ]),
]);

const projectModal = div({ id: "projectmodal", class: "modal" }, [
  div({ class: "modal-content" }, [
    elt("span", { class: "close" }, " &times;"),
    div({ id: "projectlist" }),
    elt(
      "button",
      { id: "addprojectbtn", onclick: projectF.addprojectBtn },
      "+"
    ),
    elt("input", {
      type: "text",
      id: "addprojectinput",
      name: "addprojectinput",
      placeholder: "Project",
    }),
    elt("input", {
      type: "text",
      id: "addclientinput",
      name: "addclientinput",
      placeholder: "Client",
    }),
    elt(
      "button",
      { id: "addproject", onclick: projectF.addProject() },
      "Add project"
    ),
  ]),
]);

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
    elt(
      "button",
      { id: "bulk-edit-btn", onclick: bulkEditBtn() },
      "Edit All Selected Entries"
    ),
    elt(
      "button",
      { id: "bulk-delete-btn", onclick: bulkDeleteBtn() },
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
          elt("select", { name: "project-edit", id: "project-edit" })
        ),
        elt(
          "button",
          { id: "submit-bulk-edit", onclick: submitBulkEdit() },
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
        { id: "invoice-project-btn", onclick: invoiceProjectBtn() },
        "Invoice"
      )
    )
  )
);

const timer = elt("button", { id: "timer" });

// Assemble the main structure
let mainStructure = div({}, [
  navbar,
  authContainer,
  elt(
    "button",
    { id: "projectbtn", onclick: projectF.projectBtn() },
    "Select Project"
  ),
  timer,
  elt(
    "button",
    { id: "challenge-btn", onclick: challengeBtn() },
    "What's the current challenge?"
  ),
  challengeModal,
  div({ id: "bottombar" }, [
    elt(
      "button",
      { id: "enterHoursBtn", onlclick: enterHoursBtn() },
      "Enter Time"
    ),
    enterHoursModal,
    elt("button", { id: "invoicebtn", onclick: invoicebtn() }, "Invoice"),
  ]),
  projectModal,
  elt(
    "button",
    { id: "my-time", onclick: openReporting() },
    "Toggle Reporting View"
  ),
  reportSection,
]);

// Append the main structure to the body or a specific container
document.body.appendChild(mainStructure);

// function openReporting() {
//   (reportSection.style.display || report_Style_Display) === "none"
//     ? show(reportSection)
//     : hide(reportSection);
// }
