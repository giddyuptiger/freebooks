// src/components/project.js
import { db } from "../database/db";
import { show, hide, div, elt } from "../commonFunctions";

const addprojectinput = elt("input", {
  type: "text",
  id: "addprojectinput",
  name: "addprojectinput",
  placeholder: "Project",
});

const addclientinput = elt("input", {
  type: "text",
  id: "addclientinput",
  name: "addclientinput",
  placeholder: "Client",
});
const addproject2 = elt(
  "button",
  { id: "addproject", onclick: addProject() },
  "Add project"
);

//PROJECT SCREEN
export function projectBtn() {
  if (!active) {
    console.log("choosing project");
    show(projectmodal);
  }
}
//LIVE PROJECT INFO
export function liveProjects(userRef) {
  db.ref(userRef + "/projects").on("value", function (snapshot) {
    var projectsHTML = "";
    projectObj = snapshot.val();
    // activeProject = projectObj
    console.log("projectObj:VVVVVVVV");
    console.log(projectObj);
    var projectListLength = projectEntry.options.length;
    for (i = projectListLength - 1; i >= 0; i--) {
      projectEntry.options[i] = null;
    }
    if (snapshot.val()) {
      // console.log(snapshot.val());
      snapshot.forEach(function (projectKey) {
        // console.log('HERE');
        // console.log(projectKey.key);
        var pid = projectKey.key;
        var projectName = projectKey.val().projectName;
        var clientName = projectKey.val().client;
        // console.log(
        //   "Found project: " + projectName,
        //   "with client: ".clientName
        // );
        var option = document.createElement("option");
        option.value = pid;
        option.textContent = projectName + " for " + clientName;
        option.setAttribute("data-client", clientName);
        option.setAttribute("data-project", projectName);
        var optionb = option.cloneNode(true);
        var optionc = option.cloneNode(true);
        // projectEntry.appendChild(option).setAttribute('data-client', clientName);
        // projectEntry.appendChild(option).setAttribute('data-project', projectName);
        projectEntry.appendChild(option);
        // var optionb = document.createElement("option");
        // optionb.value = pid;
        // optionb.textContent = projectName + ' for ' + clientName;
        // optionb.setAttribute('data-client', clientName)
        // optionb.setAttribute('data-project', projectName);
        projectEdit.appendChild(optionb);
        projectToInvoice.appendChild(optionc);
        var dataClient = "'data-client'";
        projectsHTML +=
          '<button id="' +
          pid +
          '" data-client="' +
          clientName +
          '" class="projectselectbtns" onclick="selectProject(this.id);">' +
          projectName +
          '<br/><p style="font-size: 1vw;"> for ' +
          clientName +
          "</p>" +
          "</button>" +
          '<button id="' +
          projectKey.key +
          '" onclick="deleteProject(this.id)"">X</button><br>';
      });
      // console.log(projectsHTML);
      projectlist.innerHTML = projectsHTML;
    } else {
      projectlist.innerHTML = "Add a new Project";
    }
  });
}

export function selectProject(pid) {
  activepid = pid;
  activeProject = projectObj[pid].projectName;
  activeClient = projectObj[pid].client;
  console.log(
    "Selected new active project: ",
    pid,
    activeProject,
    activeClient
  );
  db.ref(userRef + "/state").update({
    pid: pid,
  });
  console.log("activepid: ", activepid, activeProject, activeClient);
  hide(projectmodal);
}

export function deleteProject(projectKey) {
  if (confirm("Delete Project?")) {
    db.ref(userRef + "/projects/" + projectKey).once("value", function (snap) {
      db.ref(userRef + "/projects-deleted/" + projectKey).set(
        snap.val(),
        function (error) {
          if (!error) {
            db.ref(userRef + "/projects" + "/" + projectKey).remove();
          } else if (typeof console !== "undefined" && console.error) {
            console.error(error);
          }
        }
      );
    });
  } else {
    //Do Nothing
    console.log("Not Deleted");
  }
}

//ADD PROJECT
// var addprojectinput = document.getElementById("addprojectinput");
// var addclientinput = document.getElementById("addclientinput");
// var addprojectBtn = document.getElementById("addprojectBtn");
// var addproject = document.getElementById("addproject");
export function addprojectBtn() {
  addprojectinput.style.display = "block";
  addclientinput.style.display = "block";
  addproject2.style.display = "block";
  addprojectinput.value = "";
  addclientinput.value = "";
}
export function addProject() {
  if (/* it doesnt exist already && */ addprojectinput.value !== "") {
    db.ref(userRef + "/projects").push({
      projectName: addprojectinput.value,
      client: addclientinput.value,
    });
  }
  hide(addprojectinput);
  hide(addclientinput);
  // hide(addproject2);
}

export const projectModal = div(
  { id: "projectmodal", class: "modal" },
  div(
    { class: "modal-content" },
    elt("span", { class: "close" }, " &times;"),
    div({ id: "projectlist" }),
    elt("button", { id: "addprojectbtn", onclick: addprojectBtn() }, "+"),
    addprojectinput,
    addclientinput,
    addproject2
  )
);
