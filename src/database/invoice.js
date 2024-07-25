// src/database/invoice.js
import { db } from "./db";

export function liveInvoices(userRef) {
  console.log("liveInvoices running");
  db.ref(userRef + "/invoiced").on("value", function (snapshot) {
    invoicedSnapshot = snapshot;
    invoicesArray = [];
    // hoursHeaders = ["Date", "Client", "Project", "Hours", "Paid", "key"];
    var invoicesHeaders = [
      "Invoice Date",
      "Project",
      "Client",
      "Hours",
      "Status",
      "UNDO",
    ];
    // var entries =
    // "<tr><td>Date</td><td>Client</td><td>Project</td><td>Hours</td></tr>";
    invoicesTable.innerHTML = "";
    snapshot.forEach(function (entry) {
      var rowArray = [];
      var cell = entry.val();
      // console.log(cell.date);
      var invoiceDate = formatDate(cell.date);
      // invoiceDate = ('0' + (1 + invoiceDate.getMonth())).slice(-2) + '/' + ('0' + invoiceDate.getDay()).slice(-2) + '/' + String(invoiceDate.getFullYear()) + ' ' + ('0' + invoiceDate.getHours()).slice(-2) + ':' + ('0' + invoiceDate.getMinutes()).slice(-2)
      // console.log(invoiceDate);
      rowArray.push(invoiceDate);
      var invoicedHours = cell.totaltime
        ? (cell.totaltime / 1000 / 60 / 60).toFixed(2)
        : "NA";
      var paid = cell.paid;
      if (cell.pid !== undefined) {
        var pid = cell.pid;
        var project = projectObj[pid].projectName;
        var client = projectObj[pid].client;
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
    });
    invoicesArray.sort();
    invoicesArray.unshift(invoicesHeaders);
    // console.log(invoicesArray);
    for (var i = 0; i < invoicesArray.length; i++) {
      var row = document.createElement("tr");
      // console.log(invoicesArray[i]);
      if (invoicesArray[i][4] == "PAID") {
        row.className = "paid-invoice";
      }

      for (var j = 0; j < invoicesArray[0].length + 1; j++) {
        var cell = document.createElement("td");
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
