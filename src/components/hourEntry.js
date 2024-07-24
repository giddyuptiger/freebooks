// ENTER HOURS MODAL
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
  enterhoursmodal.style.display = "block";
  hide(editTitle);
}
export function close(modal) {
  console.log("closing...");
  hide(modal);
}
window.onclick = function (event) {
  if (event.target == enterhoursmodal) {
    hide(enterhoursmodal);
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
