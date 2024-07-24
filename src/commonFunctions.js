// FREQUENTLY USED FUNCTIONS

let body = document.body;

export function elt(type, props, ...children) {
  let element = document.createElement(type);
  // if (props) Object.assign(element, props);
  if (props && Array.isArray(props)) {
    // let atts = props[1]
    //  let props = props[0]/tera
    for (let att of Object.keys(props[1])) {
      element.setAttribute(att, props[1][att]);
    }
    Object.assign(element, props[0]);
  } else Object.assign(element, props);

  children.forEach((child) => {
    element.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    );
  });

  return element;
}

export function div(props, ...children) {
  return elt("div", props, ...children);
}

export function show(element) {
  element.classList.remove("hidden");
  // element.style.display = "block";
}

export function hide(element) {
  element.classList.add("hidden");
  // element.style.display = "none";
}

export function addLoading() {
  let loadingDiv = document.getElementById("load");
  if (loadingDiv) {
    body.append(loadingDiv);
  }
}

export function removeLoading() {
  let loadingDiv = document.getElementById("load");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// export
//   const pageElements = document.getElementsByClassName("page");
//   while (pageElements.length > 0) {
//     pageElements[0].remove(); // Remove the first element until the collection is empty
//   }
export function removePages() {
  const childrenArray = Array.from(body.children);
  for (const child of childrenArray) {
    if (child.classList.contains("page")) {
      body.removeChild(child); // Use removeChild for better compatibility
    }
  }
}

//SILLY TESTING THINGS

export function rainbowDivs() {
  const colors = ["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"];
  let colorIndex = 0;

  setInterval(() => {
    const divs = document.querySelectorAll("div");
    divs.forEach((div, index) => {
      div.style.border = `5% solid ${
        colors[(index + colorIndex) % colors.length]
      }`;
      //   div.style.backgroundImage = `linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), linear-gradient(to bottom, ${
      //     colors[(index + colorIndex) % colors.length]
      //   } 0%, ${colors[(index + colorIndex) % colors.length]} 100%)`;
      //   div.style.backgroundClip = "content-box, padding-box";
    });
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);
}

//INITIALIZE HOURS TABLE
export function liveHours() {
  // console.log("1");
  db.ref(userRef + "/uninvoiced").on("value", function (snapshot) {
    uninvoicedSnapshot = snapshot;
    hoursArray = [];
    hoursHeaders = ["Date", "Client", "Project", "Hours", "key"];
    // const entries =
    // "<tr><td>Date</td><td>Client</td><td>Project</td><td>Hours</td></tr>";
    hours.innerHTML = "";
    snapshot.forEach(function (entry) {
      const rowArray = [];
      const cell = entry.val();
      const date = new Date(cell.date);
      rowArray.push(cell.date);
      if (cell.pid !== undefined) {
        const pid = cell.pid;
        const project = projectObj[pid].projectName;
        const client = projectObj[pid].client;
        rowArray.push(client);
        rowArray.push(project);
      } else {
        rowArray.push(cell.client + " (dated entry)");
        rowArray.push(cell.project + " (dated entry)");
      }
      rowArray.push((cell.hours / 1000 / 60 / 60).toFixed(2));
      rowArray.push(entry.key);
      hoursArray.push(rowArray);
      // console.log(rowArray, hoursArray);
      //OLD HOURS TABLE
      // if (cell.hours) {
      //   entries += "<tr>";
      //   entries += "<td>" + cell.date + "<td>";
      //   entries += "<td>" + cell.project + "<td>";
      //   const time = (Math.round((cell.hours / 1000 / 60 / 60) * 4) / 4).toFixed(
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
    hoursArray.reverse();
    hoursArray.unshift(hoursHeaders);
    // console.log(hoursArray);
    for (const i = 0; i < hoursArray.length; i++) {
      const row = document.createElement("tr");
      row.innerHTML +=
        '<td><input type="checkbox" data-entrykey="' +
        hoursArray[i][4] +
        '"></td>';
      for (const j = 0; j < hoursArray[0].length + 1; j++) {
        const cell = document.createElement("td");
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
    console.log("hours innerHTML:", hours);
    // oldHoursTable.innerHTML = entries;
  });
}

//CHALLENGE Screen

export function challengeModal() {
  console.log("opening challenge modal");

  document.getElementById("challenge-input").value = "";
  show(challengeModal);

  challengeTextArea.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      challengeAcceptedbtn.click();
    }
  });
}

export function challengeAcceptedBtn() {
  console.log("Challenge Accepted!!");
  hide(challengeModal);
  // if(challengeArr){

  const challengeInput = challengeTextArea.value;
  // }
  challengebtn.innerHTML = challengeInput
    ? challengeInput
    : "What's the current challenge?";
  // challengeArr.push(challengeInput);
  activeChallenge = [challengeInput];
  activeChallenges.push(challengeInput);
  active
    ? db.ref(userRef + "/state").update({ challenges: activeChallenges })
    : console.log("not active");
  console.log(activeChallenges);
  // db.console.log("Challenges", activeChallenges);
}

//SUBMIT HOURS
// const submit = document.getElementById("submit");
// const dateEntry = document.getElementById("dateentry");
// const hoursEntry = document.getElementById("hoursentry");
export function submitHours() {
  console.log("Submitting with key(undefined if new entry): ", editingKey);
  const pid = projectEntry.options[projectEntry.selectedIndex].value;
  console.log("HERE", pid);
  const project =
    projectEntry.options[projectEntry.selectedIndex].getAttribute(
      "data-project"
    );
  const client =
    projectEntry.options[projectEntry.selectedIndex].getAttribute(
      "data-client"
    );
  // const client = "clientEntry.options[]"
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
  hide(enterhoursmodal);
}
//EDIT MODAL

export function bulkDeleteBtn() {
  const bulkEditKeys = {};
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    const entrykey = checkbox.dataset.entrykey;
    if (checkbox.checked && entrykey) {
      const path = entrykey;
      bulkEditKeys[path] = null;
    }
  });
  const numberOfEntries = Object.keys(bulkEditKeys).length;
  if (numberOfEntries > 1) {
    const deleteConfirmText = "Delete " + numberOfEntries + " entries?";
  } else if (numberOfEntries == 1 && checkboxes[0].checked) {
    return;
  } else if (numberOfEntries == 1) {
    const deleteConfirmText = "Delete Entry?";
  }
  if (confirm(deleteConfirmText)) {
    console.log("deleting:", bulkEditKeys);
    //make object with only checked entries and their new pid
    // COPY to DELETED
    const uninvoicedObj = {};
    db.ref(userRef + "/uninvoiced").once("value", function (snap) {
      console.log("entries obj:", snap.val());
      Object.keys(bulkEditKeys).forEach((key) => {
        console.log("key to move: ", key, snap.val()[key]);
        // console.log(key.val());
        const deletedEntry = snap.val()[key];
        deletedEntry.deleted = {
          ".sv": "timestamp",
        };
        // deletedEntry[deleted] = newDate();
        uninvoicedObj[key] = deletedEntry;
      });
      console.log("uninvoicedObj: ", uninvoicedObj);
      db.ref(userRef + "/deleted").update(uninvoicedObj);
      console.log("did it work?");
    });
    // REMOVE from UNINVOICED
    db.ref(userRef + "/uninvoiced").update(bulkEditKeys);
  } else {
    console.log("bulk delete cancelled");
  }
}

export function bulkEditBtn() {
  show(bulkEditModal);
}

export function submitBulkEdit() {
  const bulkEditKeys = {};
  const pid = projectEdit.options[projectEdit.selectedIndex].value;
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    const entrykey = checkbox.dataset.entrykey;
    if (checkbox.checked && entrykey) {
      // console.log(checkbox.dataset.entrykey);
      // console.log(bulkEditKeys, pid);
      const path = entrykey + "/pid";
      bulkEditKeys[path] = pid;
    }
  });
  console.log("updating:", bulkEditKeys);
  //make object with only checked entries and their new pid
  db.ref(userRef + "/uninvoiced").update(bulkEditKeys);
  hide(bulkEditModal);
}

export function editEntry(key) {
  console.log("editing: " + key);
  enterhoursmodal.style.display = "block";
  hide(enterTitle);

  db.ref(userRef + "/uninvoiced").once("value", function (snapshot) {
    try {
      oldHours = toHours(snapshot.val()[key].hours);
    } catch {
      console.log("No old hours");
      oldHours = "NA";
    }
    try {
      oldDate = snapshot.val()[key].date;
    } catch {
      console.log("No old date");
      oldDate = "NA";
    }
    try {
      oldProject = snapshot.val()[key].project;
    } catch {
      console.log("No old project");
      oldProject = "NA";
    }

    if (snapshot.val()[key].pid != undefined) {
      oldpid = snapshot.val()[key].pid;
      console.log(snapshot.val()[key].pid, "set old pid");
    } else {
      oldpid = "NA";
    }
    try {
      oldClient = snapshot.val()[key].client;
    } catch {
      console.log("No old client");
      oldClient = "NA";
    }
    console.log(
      key,
      ": ",
      oldHours,
      ", ",
      oldDate,
      ", ",
      oldProject,
      ", ",
      oldpid
    );
    hoursEntry.value = oldHours;
    dateEntry.value = oldDate;
    projectEntry.value = oldpid;
    keyBox.value = key;
    editingKey = key;
    console.log(keyBox.value);
  });
}

export function deleteEntry(key) {
  if (confirm("Are you sure you want to delete?")) {
    console.log("deleting: " + key);
    db.ref(userRef + "/uninvoiced" + "/" + key).once(
      "value",
      function (snapshot) {
        // oldHours = toHours(snapshot.val()[key].hours);
        // oldDate = snapshot.val()[key].date;
        // oldProject = snapshot.val()[key].project;
        // console.log(key, ': ', oldHours, ', ', oldDate, ', ', oldProject);
        db.ref(userRef + "/deleted/" + key).set(
          snapshot.val(),
          function (error) {
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
          }
        );
      }
    );
  } else {
    //Do Nothing
    console.log("Delete Canceled");
  }
}
//DOWNLOAD TRIGGER
export function invoiceBtn() {
  // if (confirm("Invoice selected entries?")) {
  // console.log("invoicing....");
  show(invoiceModal);
  // const itemsFormatted;
  // }
}

export function invoiceProjectBtn() {
  console.log("invoicing....");
  collectEntries();
}

// show(invoiceModal);
// const projectToInvoice = document.getElementById("project-to-invoice");
// const fromDate = document.getElementById("from-date");
// const toDate = document.getElementById("to-date");

//collect Entries
export function collectEntries() {
  const selectedPID = projectToInvoice.value;
  // const from = fromDate.value;
  // const to = toDate.value;
  // console.log(selectedPID, "from to: ", from, to);
  const keysToInvoice = {};
  // console.log(.5);
  const allKeys = Object.keys(uninvoicedSnapshot.val());
  // console.log(allKeys);
  allKeys.forEach((entry) => {
    // console.log(entry.val().pid, selectedPID);
    // console.log(uninvoicedSnapshot.val()[entry]);
    if (uninvoicedSnapshot.val()[entry].pid == selectedPID) {
      // console.log(entry.val()[key]);
      keysToInvoice[entry] = uninvoicedSnapshot.val()[entry];
      // console.log(entry.val());
    }
  });

  // console.log(keysToInvoice);
  // const checkboxes = document.querySelectorAll("input[type=checkbox]");
  // checkboxes.forEach((checkbox) => {
  //   const entrykey = checkbox.dataset.entrykey;
  //   if ( entrykey ) {
  //     const path = entrykey;
  //     keysToInvoice[path] = null;
  //   }
  // });
  const numberOfEntries = Object.keys(keysToInvoice).length;
  const confirmText = "No time available to invoice";
  if (numberOfEntries > 1) {
    confirmText = "Invoice " + numberOfEntries + " entries?";
  } else if (numberOfEntries == 1) {
    confirmText = "Invoice Entry?";
  }
  if (confirm(confirmText)) {
    // console.log("Invoicing:", keysToInvoice);

    //make object with only checked entries and their new pid
    //SEPARATE to MULTIPLE OBJs for EACH PROJECT

    // COPY to INVOICED
    const uninvoicedObj = {};
    const entriesObj = {};
    db.ref(userRef + "/uninvoiced").once("value", function (snap) {
      // console.log("entries obj:", snap.val());
      // console.log(keysToInvoice);
      const totaltime = 0;
      Object.keys(keysToInvoice).forEach((key) => {
        // console.log("key to move: ", key, snap.val()[key]);
        // console.log(key.val());
        const invoicedEntry = snap.val()[key];
        // const hours = snap.key.hours
        totaltime += snap.val()[key]["hours"];
        // console.log(invoicedEntry);
        // invoicedEntry.invoiced = {
        //   ".sv": "timestamp",
        // };
        // console.log(uninvoicedObj);
        entriesObj[key] = invoicedEntry;
        // console.log("uninvoicedObj = ", uninvoicedObj);
      });
      // console.log(totaltime);
      // console.log("uninvoicedObj: ", uninvoicedObj);
      const invoiceTimestamp = new Date();
      uninvoicedObj["pid"] = selectedPID;
      uninvoicedObj["totaltime"] = totaltime;
      // uninvoicedObj["date"] = invoiceTimestamp;
      uninvoicedObj["entries"] = entriesObj;
      uninvoicedObj["date"] = {
        ".sv": "timestamp",
      };
      // uninvoicedObj[date] = date;
      // console.log("uninvoicedObj: ", uninvoicedObj);
      console.log("invoice timestamp: ", invoiceTimestamp);
      db.ref(`${userRef}/invoiced`).push(uninvoicedObj);
      console.log("uninvoicedObj:VVVVVVVVVVV");
      console.log(uninvoicedObj);
      const entriesArray = Object.values(uninvoicedObj["entries"]);
      // const entriesArray;
      // for (key in uninvoicedObj) {
      //   console.log(uninvoicedObj.key);
      //   entriesArray.push(uninvoicedObj.key);
      // }
      console.log(entriesArray);
      itemsNotFormatted = entriesArray;
      const itemsFormatted = formatData(itemsNotFormatted);
      console.log(itemsFormatted);
      //CREATE file TITLE
      // fileTitle = projectObj.pid.projectName + 'for' + projectObj.pid.client
      exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
    });
    // REMOVE from UNINVOICED
    Object.keys(keysToInvoice).forEach((key) => {
      db.ref(userRef + "/uninvoiced/" + key).remove();
    });
  } else {
    console.log("invoice cancelled");
  }

  //create CSV
  // console.log(objArray);
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  const str = "";

  for (const i = 0; i < array.length; i++) {
    const line = "";
    for (const index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  // console.log(str);
  return str;
}

export function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  const jsonObject = JSON.stringify(items);

  const csv = this.convertToCSV(jsonObject);

  const exportedFilenmae = fileTitle + ".csv" || "export.csv";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  // console.log("csv downloaded I think");
  //clear itemsFormatted
  itemsFormatted = [];
  hide(invoiceModal);
}

export const headers = {
  // model: "Phone Model".replace(/,/g, ""), // remove commas to avoid errors
  // chargers: "Chargers",
  // cases: "Cases",
  // earphones: "Earphones",
  date: "Date",
  hours: "Hours",
  starttime: "Start Time",
  stoptime: "Stop Time",
  // notes: "notes",
};

// itemsNotFormatted = [
//   {
//     model: "Samsung S7",
//     chargers: "55",
//     cases: "56",
//     earphones: "57",
//     scratched: "2",
//   },
//   {
//     model: "Pixel XL",
//     chargers: "77",
//     cases: "78",
//     earphones: "79",
//     scratched: "4",
//   },
//   {
//     model: "iPhone 7",
//     chargers: "88",
//     cases: "89",
//     earphones: "90",
//     scratched: "6",
//   },
// ];

// format the data
export function formatData(data) {
  const itemsFormatted = [];
  itemsNotFormatted.forEach((item) => {
    itemsFormatted.push({
      // model: item.model.replace(/,/g, ""), // remove commas to avoid errors,
      // chargers: item.chargers,
      // cases: item.cases,
      // earphones: item.earphones,
      date: item.date,
      hours: toHours(item.hours),
      starttime: item.starttime ? timeFromUnix(item.starttime) : "",
      stoptime: item.stoptime ? timeFromUnix(item.stoptime) : "",
      // notes: item.notes,
    });
  });
  console.log(itemsFormatted);
  return itemsFormatted;
}

export function timeFromUnix(unix) {
  const date = new Date(unix);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const time = hours + ":" + minutes;
  return time;
}

const fileTitle = "Invoice"; // or 'Timestamp + Client + Project'

export function twoDigits(time) {
  return (time < 10 ? "0" : "") + time;
}

export function toHours(ms) {
  return (Math.round((ms / 1000 / 60 / 60) * 4) / 4).toFixed(2);
}

export function toMS(hours) {
  return hours * 1000 * 60 * 60;
}

// const reportSection = document.getElementById("report");
// const openReport = document.getElementById("my-time");
// let report_Style_Display = window.getComputedStyle(reportSection).display;
export function openReporting() {
  (reportSection.style.display || report_Style_Display) === "none"
    ? show(reportSection)
    : hide(reportSection);
}

export function openTab(evt, tabName) {
  // Declare all constiables
  let i, tabcontent, tablinks, activeTab;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    if (tabcontent[i].style.display == "block") {
      activeTab = tabcontent[i].getAttribute("id");
      // console.log(activeTab);
    }
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  console.log(tabName, activeTab, activeTab == tabName);
  if (tabName != activeTab) {
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
}

//invoices tab
const invoicesTable = document.getElementById("invoices-table");

export function liveInvoices() {
  console.log("liveInvoices running");
  db.ref(userRef + "/invoiced").on("value", function (snapshot) {
    invoicedSnapshot = snapshot;
    invoicesArray = [];
    // hoursHeaders = ["Date", "Client", "Project", "Hours", "Paid", "key"];
    const invoicesHeaders = [
      "Invoice Date",
      "Project",
      "Client",
      "Hours",
      "Status",
      "UNDO",
    ];
    // const entries =
    // "<tr><td>Date</td><td>Client</td><td>Project</td><td>Hours</td></tr>";
    invoicesTable.innerHTML = "";
    snapshot.forEach(function (entry) {
      const rowArray = [];
      const cell = entry.val();
      // console.log(cell.date);
      const invoiceDate = formatDate(cell.date);
      // invoiceDate = ('0' + (1 + invoiceDate.getMonth())).slice(-2) + '/' + ('0' + invoiceDate.getDay()).slice(-2) + '/' + String(invoiceDate.getFullYear()) + ' ' + ('0' + invoiceDate.getHours()).slice(-2) + ':' + ('0' + invoiceDate.getMinutes()).slice(-2)
      // console.log(invoiceDate);
      rowArray.push(invoiceDate);
      const invoicedHours = cell.totaltime
        ? (cell.totaltime / 1000 / 60 / 60).toFixed(2)
        : "NA";
      const paid = cell.paid;
      if (cell.pid !== undefined) {
        const pid = cell.pid;
        const project = projectObj[pid].projectName;
        const client = projectObj[pid].client;
        rowArray.push(client);
        rowArray.push(project);
      } else {
        rowArray.push(cell.client + " (dated entry)");
        rowArray.push(cell.project + " (dated entry)");
      }
      rowArray.push(invoicedHours);
      if (paid) {
        rowArray.push("PAID");
      } else {
        rowArray.push("Due");
      }
      // console.log(invoicedHours);
      rowArray.push(entry.key);
      invoicesArray.push(rowArray);
      // console.log(rowArray, hoursArray);
      //OLD HOURS TABLE
      // if (cell.hours) {
      //   entries += "<tr>";
      //   entries += "<td>" + cell.date + "<td>";
      //   entries += "<td>" + cell.project + "<td>";
      //   const time = (Math.round((cell.hours / 1000 / 60 / 60) * 4) / 4).toFixed(
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
    invoicesArray.sort();
    invoicesArray.unshift(invoicesHeaders);
    // console.log(invoicesArray);
    for (const i = 0; i < invoicesArray.length; i++) {
      const row = document.createElement("tr");
      // console.log(invoicesArray[i]);
      if (invoicesArray[i][4] == "PAID") {
        row.className = "paid-invoice";
      }
      // row.innerHTML +=
      //   '<td><input type="checkbox" data-entrykey="' +
      //   invoicesArray[i][4] +
      //   '"></td>';
      for (const j = 0; j < invoicesArray[0].length + 1; j++) {
        const cell = document.createElement("td");
        cell.innerHTML += invoicesArray[i][j];
        if (j === invoicesArray[i].length - 1) {
          cell.style.display = "none";
        }
        if (j === invoicesArray[i].length) {
          cell.innerHTML =
            '<button class="invoice-button undo-invoice" id="' +
            invoicesArray[i][5] +
            '" onClick="undoInvoice(this.id)"> UNDO </button>' +
            '<button class="invoice-button mark-paid" id="' +
            invoicesArray[i][5] +
            '" onClick="togglePaid(this.id)">Mark Paid</button>';
        }
        row.appendChild(cell);
      }
      invoicesTable.appendChild(row);
    }
    // console.log("invoices innerHTML:", invoicesTable);
    // oldHoursTable.innerHTML = entries;
  });
}

export function undoInvoice(id) {
  const invoiceToUndoRef = invoicedRef.child("id");
  console.log("undoing Invoice" + id);
  // moveFBRecord(invoiceToUndoRef, uninvoicedRef);
  db.ref(userRef + "/invoiced/" + id).once("value", function (snap) {
    console.log(snap.val().entries);
    db.ref(userRef + "/uninvoiced").update(
      snap.val().entries,
      function (error) {
        if (!error) {
          db.ref(userRef + "/invoiced/" + id).remove();
        } else if (typeof console !== "undefined" && console.error) {
          console.error(error);
        }
      }
    );
  });
}

export function togglePaid(id) {
  db.ref(userRef + "/invoiced/" + id).once("value", function (snap) {
    if (snap.val() == undefined || snap.val().paid == false) {
      if (confirm('Are you sure you want to mark this invoice as "Paid"?')) {
        db.ref(userRef + "/invoiced/" + id).update({ paid: true });
      }
    } else {
      if (
        confirm('Are you sure you want to mark this invoice as "Not Paid"?')
      ) {
        db.ref(userRef + "/invoiced/" + id).update({ paid: false });
      }
    }
  });
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(date) {
  const d = new Date(date);
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  const year = d.getFullYear();
  let hours = ("0" + d.getHours()).slice(-2);
  let minutes = ("0" + d.getMinutes()).slice(-2);
  let seconds = ("0" + d.getSeconds()).slice(-2);
  let ampm = "a";
  if (hours >= 12) {
    hours = hours - 12;
    ampm = "p";
  }
  if (hours == 0) {
    hours = 12;
  }
  return year + "/" + month + "/" + day + " " + hours + ":" + minutes + ampm;
}
