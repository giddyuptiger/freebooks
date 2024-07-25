import { hide, show, elt, div } from "../commonFunctions";

// ENTER HOURS MODAL
const projectEntry = elt("label", { for: "projectentry" }, "Project");
const dateEntry = elt("input", {
  type: "date",
  id: "dateentry",
  name: "date",
  min: "2020-01-01",
});

const enterHoursModal = div(
  { id: "enterhours", class: "modal" },
  div(
    { class: "modal-content" },
    elt(
      "span",
      {
        class: "close",
        onclick: () => {
          close(enterHoursModal);
        },
      },
      " &times;"
    ),
    elt("h1", { id: "enter-title" }, "Enter Time"),
    elt("h1", { id: "edit-title" }, "Edit Entry"),
    elt("label", { for: "hoursentry" }, "Hours"),
    elt("input", { type: "text", id: "hoursentry", name: "hours" }),
    elt("label", { for: "dateentry" }, "Date:"),
    dateEntry,
    projectEntry,
    elt("select", { name: "project", id: "projectentry" }),
    elt("input", { type: "text", id: "key" }),
    elt(
      "button",
      {
        id: "submit",
        onclick: () => {
          submitHours();
        },
      },
      "Submit"
    )
  )
);

// let enterhoursmodal = document.getElementById("enterhours");
// let enterhoursbtn = document.getElementById("enterhoursbtn");
// let span = document.getElementsByClassName("close")[0];
// let editmodal = document.getElementById("edit");
// let editbtn = document.getElementById("editbtn");
// let editspan = document.getElementsByClassName("close")[1];
// let enterTitle = document.getElementById("enter-title");
let editTitle = document.getElementById("edit-title");
// let oldHours, oldDate, oldProject, oldpid;
export function enterHoursBtn() {
  hoursEntry.value = "";
  dateEntry.value = "";
  projectEntry.value = "";
  keyBox.value = "";
  enterHoursModal.style.display = "block";
  hide(editTitle);
}
export function close(modal) {
  console.log("closing...");
  hide(modal);
}
window.onclick = function (event) {
  if (event.target == enterHoursModal) {
    hide(enterHoursModal);
  } else if (event.target == projectmodal) {
    hide(projectmodal);
    hide(addprojectinput);
    hide(addclientinput);
    hide(addproject);
  } else if (event.target == challengeModal) {
    hide(challengeModal);
  } else if (event.target == bulkEditModal) {
    hide(bulkEditModal);
  } else if (event.target == invoiceModal) {
    hide(invoiceModal);
  }
};

let editingKey;

export function submitHours() {
  console.log("Submitting with key(undefined if new entry): ", editingKey);
  // const pid = projectEntry.options[projectEntry.selectedIndex].value;
  const pid = state.pid;
  console.log("HERE", pid);
  const project =
    projectEntry.options[projectEntry.selectedIndex].getAttribute(
      "data-project"
    );
  const client =
    projectEntry.options[projectEntry.selectedIndex].getAttribute(
      "data-client"
    );
  // const client = "clientEntry.options[]";
  const date = dateEntry.value;
  const hours = hoursEntry.value * 60 * 60 * 1000;
  // const key = keyBox.value;
  if (!editingKey) {
    db.ref(userRef + "/uninvoiced").push({
      submittedtime: {
        ".sv": "timestamp",
      },
      pid: pid,
      // client: client,
      hours: hours,
      date: date,
    });
  } else {
    console.log("updating old entry", oldpid);
    db.ref(userRef + "/uninvoiced" + "/" + editingKey).set({
      history: {
        hours: toMS(oldHours),
        date: oldDate,
        pid: oldpid,
        // client: oldClient
      },
      hours: hours,
      date: date,
      pid: pid,
      // client: client
    });
    editingKey = undefined;
  }
  hide(enterHoursModal);
}
//EDIT MODAL
