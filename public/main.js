// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", {
  signInOptions: [
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // {
    //       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //       requireDisplayName: false
    //     }
    // List of OAuth providers supported.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //optional display name
    // provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // requireDisplayName: false
  ],
  // Other config options...
});

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);

var signin = document.getElementById("firebaseui-auth-container");
var logout = document.getElementById("logoutbtn");
// var uid;
var uid;
var userRef;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const timer = document.getElementById("timer");
const projectSelector = document.getElementById("project");
const projectSelect = document.getElementById("projectselect");
const projectEntry = document.getElementById("projectentry");
const hours = document.getElementById("hours-table");
const oldHoursTable = document.getElementById("oldhours-table");
const enterHoursBtn = document.getElementById("enterhoursbtn");
const keyBox = document.getElementById("key");
var db = firebase.database();
var activeProject, activeClient;
timer.addEventListener("click", startTimer);
var projectmodal = document.getElementById("projectmodal");
var projectbtn = document.getElementById("projectbtn");
// var uid = 'jeremy';
// if (uid) {
// var userRef = "users/" + uid;
//   console.log("hi", uid);
// } else {
//   userRef = "users/jeremy";
// }
var editingKey;
var starttime;
var hoursArray;
var active = false;
//AUTH CHECK
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user.email, "logged in");
    uid = user.uid;
    userRef = "users/" + uid;
    hide(signin);
    // logout.style.display = "block";
    show(logout);
    db.ref(userRef + "/state").on("value", function (snapshot) {
      try {
        console.log("trying to read /state");
        active = snapshot.val().active;
        activeProject = snapshot.val().project;
        activeClient = snapshot.val().client;
        console.log(
          "Updating state to:",
          "\nproject: ",
          activeProject,
          "\nclient: ",
          activeClient,
          "\nactive?:",
          active
        );
        if (snapshot.exists() && active) {
          projectbtn.classList.add("inactive");
          console.log("UPDATED TIMER STATE, starttime: " + starttime);
        } else {
          projectbtn.classList.remove("inactive");
          console.log('UPDATED TIMER STATE "stopped"');
        }
        if (activeProject) {
          projectbtn.innerHTML = "Project: " + activeProject;
        }
        starttime = snapshot.val().starttime;
      } catch {
        console.log("couldn't reach active, creating it now...");
        db.ref(userRef + "/state").set({ active: false });
      }
    });
    liveProjects();
    liveHours();
    // db.ref(userRef).once("value", function (snapshot) {
    //   console.log(snapshot.val());
    //   if (!snapshot.val()) {
    //     console.log("it doesnt exist");
    //   } else {
    //     console.log("it exists");
    //   }
    // });
    show(timer);
    show(projectbtn);
  } else {
    // No user is signed in.
    // signin.style.display = "block";
    hide(logout);
    show(signin);
    hide(timer);
    hide(projectbtn);
    console.log("no user logged in");
  }
});

logout.onclick = function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      show(signin);
      hide(timer);
      hours.innerHTML = "";
      console.log("logged out");
    })
    .catch(function (error) {
      console.log(error);
    });
  //   show(signin);
};

//INITIALIZE TIMER STATE
// if (db.ref(userRef)) {
//UNCOMMENT ASAP

// } else {
// }

//INITIALIZE HOURS TABLE
function liveHours() {
  console.log("1");
  db.ref(userRef + "/uninvoiced").on("value", function (snapshot) {
    hoursArray = [["Date", "Client", "Project", "Hours", "key"]];
    // var entries =
    // "<tr><td>Date</td><td>Client</td><td>Project</td><td>Hours</td></tr>";
    hours.innerHTML = "";
    snapshot.forEach(function (entry) {
      var rowArray = [];
      var cell = entry.val();
      var date = new Date(cell.date);
      rowArray.push(cell.date);
      rowArray.push(cell.client);
      rowArray.push(cell.project);
      rowArray
        .push(Math.round((cell.hours / 1000 / 60 / 60) * 4) / 4)
        .toFixed(2);
      rowArray.push(entry.key);
      hoursArray.push(rowArray);
      // console.log(rowArray, hoursArray);
      //OLD HOURS TABLE
      // if (cell.hours) {
      //   entries += "<tr>";
      //   entries += "<td>" + cell.date + "<td>";
      //   entries += "<td>" + cell.project + "<td>";
      //   var time = (Math.round((cell.hours / 1000 / 60 / 60) * 4) / 4).toFixed(
      //     2
      //   );
      //   entries += "<td>" + time + "<td>";
      //   entries += '<td style="display:none">' + entry.key + "<td>";
      //   entries +=
      //     '<td> <button id="' +
      //     entry.key +
      //     '" onClick="editEntry(this.id)"> ✎ </button></td> <td><button id="' +
      //     entry.key +
      //     '" onClick="deleteEntry(this.id)"> X </button> </td>';
      //   entries += "</tr>";
      // }
    });
    console.log(hoursArray);
    for (var i = 0; i < hoursArray.length; i++) {
      var row = document.createElement("tr");
      for (var j = 0; j < hoursArray[0].length + 1; j++) {
        var cell = document.createElement("td");
        cell.innerHTML += hoursArray[i][j];
        if (j === hoursArray[i].length - 1) {
          cell.style.display = "none";
        }
        if (j === hoursArray[i].length) {
          cell.innerHTML =
            '<button id="' +
            hoursArray[i][4] +
            '" onClick="editEntry(this.id)"> ✎ </button><button id="' +
            hoursArray[i][4] +
            '" onClick="deleteEntry(this.id)"> X </button>';
        }
        row.appendChild(cell);
      }
      hours.appendChild(row);
    }
    console.log(hours);
    // oldHoursTable.innerHTML = entries;
  });
}
//TICKING TIMER
var x = setInterval(() => {
  if (starttime !== undefined) {
    var now = new Date().getTime();
    var distance = now - starttime;
    var hours = twoDigits(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    var minutes = twoDigits(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    );
    var seconds = twoDigits(Math.floor((distance % (1000 * 60)) / 1000));
    timer.innerHTML =
      '<span id="timerstop">' +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      "</span>";
  } else {
    timer.innerHTML = "START";
  }
}, 1000);

//START/STOP TIMER FUNCTIONS
function startTimer() {
  console.log("running startTimer");
  db.ref(userRef + "/state")
    .once("value")
    .then(function (snapshot) {
      if (activeProject) {
        console.log("activeclient: ", activeClient);
        if (!snapshot.exists() || !snapshot.val().active) {
          /*THEN START TIMER*/ timer.innerHTML = "00:00:00";
          const currentTime = new Date();
          var newKey = db.ref(userRef).push().key;
          console.log("2");
          db.ref(userRef + "/state").set({
            active: true,
            key: newKey,
            starttime: {
              ".sv": "timestamp",
            },
            project: activeProject,
            client: activeClient,
          });
          // db.ref(userRef + "/uninvoiced" + "/" + newKey).set({
          //   starttime: {
          //     ".sv": "timestamp",
          //   },
          //   stoptime: null,
          //   project: activeProject,
          // });
          console.log("startTimer running for project:", activeProject);
        } /*THEN STOP TIMER*/ else {
          var key = snapshot.val().key;
          var stoptime = new Date();
          var starttime = snapshot.val().starttime;
          var hours = stoptime - starttime;
          var project = activeProject;
          var client = activeClient;
          var date =
            new Date(starttime).getFullYear() +
            "-" +
            twoDigits(new Date(starttime).getMonth() + 1) +
            "-" +
            twoDigits(new Date(starttime).getDate());
          db.ref(userRef + "/state").update({
            active: false,
            key: null,
            starttime: null,
          });
          db.ref(userRef + "/uninvoiced" + "/" + key).set({
            starttime: starttime,
            stoptime: {
              ".sv": "timestamp",
            },
            hours: hours,
            date: date,
            project: project,
            client: client,
          });
        }
      } else {
        console.log("no project selected");
      }
    });
}

// function stopTimer() {
//     console.log("running stopTimer");

//     db.ref(userRef + '/state').once('value').then(function(snapshot) {
//         if (snapshot.val().active) {
//             timer.innerHTML = "Ready to work?";
//             var key = snapshot.val().key
//             var stoptime = new Date()
//             var hours = stoptime - starttime;
//             var date = new Date(starttime).getFullYear() + '-' + twoDigits((new Date(starttime).getMonth() + 1)) + '-' + twoDigits(new Date(starttime).getDate());
//             db.ref(userRef + '/state').update({
//                 active: false,
//                 key: null,
//                 starttime: null,
//             });
//             db.ref(userRef + '/uninvoiced' + '/' + key).update({
//                 stoptime: stoptime,
//                 hours: hours,
//                 date: date,
//             });

//             projectSelector.style.display = "block";
//         }
//     })
//     timer.innerHTML = "Nice work today";
//     console.log("timer stopped for current project")
// }
// ENTER HOURS MODAL
var enterhoursmodal = document.getElementById("enterhours");
var enterhoursbtn = document.getElementById("enterhoursbtn");
var span = document.getElementsByClassName("close")[0];
var editmodal = document.getElementById("edit");
// var editbtn = document.getElementById("editbtn");
var editspan = document.getElementsByClassName("close")[1];
var enterTitle = document.getElementById("enter-title");
var editTitle = document.getElementById("edit-title");
var oldHours, oldDate, oldProject;
enterhoursbtn.onclick = function () {
  hoursEntry.value = "";
  dateEntry.value = "";
  projectEntry.value = "";
  keyBox.value = "";
  enterhoursmodal.style.display = "block";
  hide(editTitle);
};
span.onclick = function () {
  console.log("closing...");
  hide(enterhoursmodal);
};
window.onclick = function (event) {
  if (event.target == enterhoursmodal) {
    hide(enterhoursmodal);
  } else if (event.target == projectmodal) {
    hide(projectmodal);
    hide(addprojectinput);
    hide(addclientinput);
    hide(addproject);
  }
};

// function hides() {
//     var modals = document.getElementsByClassName('modal');
//     console.log(modals);
//     modals.forEach(modal => hide(modal));
//     }

function hide(element) {
  element.style.display = "none";
}

function show(element) {
  element.style.display = "block";
}
//PROJECT SCREEN
projectbtn.onclick = function () {
  if (!active) {
    console.log("choosing project");
    projectmodal.style.display = "block";
  }
};
//LIVE PROJECT INFO
function liveProjects() {
  db.ref(userRef + "/projects").on("value", function (snapshot) {
    var projectsHTML = "";
    if (snapshot.val()) {
      // console.log(snapshot.val());
      snapshot.forEach(function (projectKey) {
        var projectName = projectKey.val().projectName;
        var clientName = projectKey.val().client;
        console.log(
          "Found project: " + projectName,
          "with client: ".clientName
        );
        var option = document.createElement("option");
        option.value = projectName;
        option.textContent = projectName;
        projectEntry.appendChild(option);
        var dataClient = "'data-client'";
        projectsHTML +=
          '<button id="' +
          projectName +
          '" data-client="' +
          clientName +
          '" class="projectselectbtns" onclick="selectProject(this.id, this.getAttribute(' +
          dataClient +
          '));">' +
          projectName +
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

function selectProject(project, client) {
  console.log("Selected ", project, client);
  activeProject = project;
  activeClient = client;
  db.ref(userRef + "/state").update({
    project: project,
    client: client,
  });
  console.log(activeProject);
  hide(projectmodal);
}

function deleteProject(projectKey) {
  db.ref(userRef + "/projects" + "/" + projectKey).remove();
}

//ADD PROJECT
var addprojectinput = document.getElementById("addprojectinput");
var addclientinput = document.getElementById("addclientinput");
var addprojectbtn = document.getElementById("addprojectbtn");
var addproject = document.getElementById("addproject");
addprojectbtn.onclick = function () {
  addprojectinput.style.display = "block";
  addclientinput.style.display = "block";
  addproject.style.display = "block";
  addprojectinput.value = "";
  addclientinput.value = "";
};
addproject.onclick = function () {
  if (/* it doesnt exist already && */ addprojectinput.value !== "") {
    db.ref(userRef + "/projects").push({
      projectName: addprojectinput.value,
      client: addclientinput.value,
    });
  }
  hide(addprojectinput);
  hide(addclientinput);
  hide(addproject);
};

//SUBMIT HOURS
var submit = document.getElementById("submit");
var dateEntry = document.getElementById("dateentry");
var hoursEntry = document.getElementById("hoursentry");
submit.onclick = function () {
  console.log("Submitting with key(undefined if new entry): ", editingKey);
  const project = projectEntry.options[projectEntry.selectedIndex].value;
  // const client = "clientEntry.options[]"
  const date = dateEntry.value;
  const hours = hoursEntry.value * 60 * 60 * 1000;
  // const key = keyBox.value;
  if (!editingKey) {
    db.ref(userRef + "/uninvoiced").push({
      submittedtime: {
        ".sv": "timestamp",
      },
      project: project,
      // client: client,
      hours: hours,
      date: date,
    });
  } else {
    console.log("updating old entry");
    db.ref(userRef + "/uninvoiced" + "/" + editingKey).set({
      history: {
        hours: toMS(oldHours),
        date: oldDate,
        project: oldProject,
      },
      hours: hours,
      date: date,
      project: project,
    });
    editingKey = undefined;
  }
  hide(enterhoursmodal);
};
//EDIT MODAL

function editEntry(key) {
  console.log("editing: " + key);
  enterhoursmodal.style.display = "block";
  hide(enterTitle);

  db.ref(userRef + "/uninvoiced").once("value", function (snapshot) {
    oldHours = toHours(snapshot.val()[key].hours);
    oldDate = snapshot.val()[key].date;
    oldProject = snapshot.val()[key].project;
    console.log(key, ": ", oldHours, ", ", oldDate, ", ", oldProject);
    hoursEntry.value = oldHours;
    dateEntry.value = oldDate;
    projectEntry.value = oldProject;
    keyBox.value = key;
    editingKey = key;
    console.log(keyBox.value);
  });
}

function deleteEntry(key) {
  console.log("deleting: " + key);
  db.ref(userRef + "/uninvoiced" + "/" + key).once("value", function (
    snapshot
  ) {
    // oldHours = toHours(snapshot.val()[key].hours);
    // oldDate = snapshot.val()[key].date;
    // oldProject = snapshot.val()[key].project;
    // console.log(key, ': ', oldHours, ', ', oldDate, ', ', oldProject);
    db.ref(userRef + "/deleted/" + key).set(snapshot.val(), function (error) {
      if (!error) {
        db.ref(userRef + "/deleted/" + key).update({
          deleted: {
            ".sv": "timestamp",
          },
        });
        db.ref(userRef + "/uninvoiced" + "/" + key).remove();
      } else if (typeof console !== "undefined" && console.error) {
        console.error(error);
      }
    });
  });
}
//DOWNLOAD TRIGGER
var invoice = document.getElementById("invoicebtn");
invoice.onclick = function () {
  console.log("invoicing....");
  exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
};

//create CSV
function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

var headers = {
  model: "Phone Model".replace(/,/g, ""), // remove commas to avoid errors
  chargers: "Chargers",
  cases: "Cases",
  earphones: "Earphones",
};

itemsNotFormatted = [
  {
    model: "Samsung S7",
    chargers: "55",
    cases: "56",
    earphones: "57",
    scratched: "2",
  },
  {
    model: "Pixel XL",
    chargers: "77",
    cases: "78",
    earphones: "79",
    scratched: "4",
  },
  {
    model: "iPhone 7",
    chargers: "88",
    cases: "89",
    earphones: "90",
    scratched: "6",
  },
];

var itemsFormatted = [];

// format the data
itemsNotFormatted.forEach((item) => {
  itemsFormatted.push({
    model: item.model.replace(/,/g, ""), // remove commas to avoid errors,
    chargers: item.chargers,
    cases: item.cases,
    earphones: item.earphones,
  });
});

var fileTitle = "orders"; // or 'my-unique-title'

function twoDigits(time) {
  return (time < 10 ? "0" : "") + time;
}

function toHours(ms) {
  return (Math.round((ms / 1000 / 60 / 60) * 4) / 4).toFixed(2);
}

function toMS(hours) {
  return hours * 1000 * 60 * 60;
}
