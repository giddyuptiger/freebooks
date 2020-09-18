console.log("running js");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const timer = document.getElementById("timer");
const projectSelector = document.getElementById("project");
const projectSelect = document.getElementById("projectselect");
const projectEntry = document.getElementById("projectentry");
const hours = document.getElementById("hours");
const enterHoursBtn = document.getElementById("enterhoursbtn");
const keyBox = document.getElementById("key");
var database = firebase.database();
timer.addEventListener("click", startTimer);
// startButton.addEventListener("click", startTimer);
// stopButton.addEventListener("click", stopTimer);
var username = 'jeremy';
var userRef = 'users/' + username;
var editingKey
    //INITIALIZE TIMER STATE
var starttime;
firebase.database().ref(userRef + '/active').on('value', function(snapshot) {
    if (snapshot.exists() && snapshot.val().active) {
        projectSelector.style.display = "none";
        const project = projectSelector.options[projectSelector.selectedIndex].value;
        projectSelect.innerHTML = "Project: " + project;
    } else {}
    starttime = snapshot.val().starttime;
    console.log("UPDATED TIMER STATE, starttime: " + starttime);
});
//INITIALIZE HOURS TABLE
firebase.database().ref(userRef).on('value', function(snapshot) {
    var entries = '<tr><td>Date</td><td>Client</td><td>Project</td><td>Hours</td></tr>';
    snapshot.forEach(function(entry) {
        var cell = entry.val();
        var date = new Date(cell.date);
        if (cell.date) {
            entries += '<tr>';
            entries += '<td>' + cell.date + '<td>';
            entries += '<td>' + cell.project + '<td>';
            var time = (Math.round((cell.hours / 1000 / 60 / 60) * 4) / 4).toFixed(2);
            entries += '<td>' + time + '<td>';
            entries += '<td style="display:none">' + entry.key + '<td>';
            entries += '<td> <button id="' + entry.key + '" onClick="editEntry(this.id)"> ✎ </button></td> <td><button id="' + entry.key + '" onClick="deleteEntry(this.id)"> X </button> </td>';
            entries += '</tr>';
        }

    });
    hours.innerHTML = entries;
});
//TICKING TIMER
var x = setInterval(() => {
    if (starttime !== undefined) {
        var now = new Date().getTime();
        var distance = now - starttime;
        var hours = twoDigits(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        var minutes = twoDigits(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        var seconds = twoDigits(Math.floor((distance % (1000 * 60)) / 1000));
        timer.innerHTML = '<span id="timerstop">' + hours + ':' + minutes + ':' + seconds + '</span>';
    } else {
        timer.innerHTML = 'START';
    }
}, 1000);

//START/STOP TIMER FUNCTIONS
function startTimer() {
    console.log("running startTimer");
    firebase.database().ref(userRef + '/active').once('value').then(function(snapshot) {
        if (!snapshot.exists() || !snapshot.val().active) {
            timer.innerHTML = "00:00:00";
            const project = projectSelector.options[projectSelector.selectedIndex].value;
            const currentTime = new Date();
            var newKey = firebase.database().ref(userRef).push().key;
            firebase.database().ref(userRef + '/active').set({
                active: true,
                key: newKey,
                starttime: {
                    ".sv": "timestamp"
                },
                project: project,
            });
            firebase.database().ref(userRef + '/' + newKey).set({
                starttime: {
                    ".sv": "timestamp"
                },
                stoptime: null,
                project: project,
            });
            console.log("startTimer running for project:", project);
        } else {
            timer.innerHTML = "Ready to work?";
            var key = snapshot.val().key
            var stoptime = new Date()
            var hours = stoptime - snapshot.val().starttime;
            var date = new Date(snapshot.val().starttime).getFullYear() + '-' + twoDigits((new Date(snapshot.val().starttime).getMonth() + 1)) + '-' + twoDigits(new Date(snapshot.val().starttime).getDate());
            firebase.database().ref(userRef + '/active').set({
                active: false,
                key: null,
                starttime: null,
                project: null,
            });
            firebase.database().ref(userRef + '/' + key).update({
                stoptime: stoptime,
                hours: hours,
                date: date,
            });

            projectSelector.style.display = "block";
        }
    });
}

function stopTimer() {
    console.log("running stopTimer");

    firebase.database().ref(userRef + '/active').once('value').then(function(snapshot) {
        if (snapshot.val().active) {
            timer.innerHTML = "Ready to work?";
            var key = snapshot.val().key
            var stoptime = new Date()
            var hours = stoptime - snapshot.val().starttime;
            var date = new Date(snapshot.val().starttime).getFullYear() + '-' + twoDigits((new Date(snapshot.val().starttime).getMonth() + 1)) + '-' + twoDigits(new Date(snapshot.val().starttime).getDate());
            firebase.database().ref(userRef + '/active').set({
                active: false,
                key: null,
                starttime: null,
                project: null,
            });
            firebase.database().ref(userRef + '/' + key).update({
                stoptime: stoptime,
                hours: hours,
                date: date,
            });

            projectSelector.style.display = "block";
        }
    })
    timer.innerHTML = "Nice work today";
    console.log("timer stopped for current project")
}
// ENTER HOURS MODAL
var enterhoursmodal = document.getElementById("enterhours");
var projectmodal = document.getElementById('projectmodal');
var enterhoursbtn = document.getElementById("enterhoursbtn");
var span = document.getElementsByClassName("close")[0];
var editmodal = document.getElementById("edit");
// var editbtn = document.getElementById("editbtn");
var editspan = document.getElementsByClassName("close")[1];
var enterTitle = document.getElementById("enter-title");
var editTitle = document.getElementById("edit-title");
var projectbtn = document.getElementById('projectbtn');
var oldHours,
    oldDate,
    oldProject;
enterhoursbtn.onclick = function() {
    hoursEntry.value = '';
    dateEntry.value = '';
    projectEntry.value = '';
    keyBox.value = '';
    enterhoursmodal.style.display = "block";
    editTitle.style.display = "none";
}
projectbtn.onclick = function() {
    console.log('choosing project');
    projectmodal.style.display = "block";
    projectlist.innerHTML = 'project list'
}
span.onclick = function() {
    console.log('closing...');
    enterhoursmodal.style.display = "none";
}
window.onclick = function(event) {
        if (event.target == enterhoursmodal || projectmodal) {
            enterhoursmodal.style.display = "none";
        }
    }
    //SUBMIT HOURS 
var submit = document.getElementById("submit");
var dateEntry = document.getElementById("dateentry");
var hoursEntry = document.getElementById("hoursentry");
submit.onclick = function() {
        console.log('Submitting with key: ', editingKey);
        const project = projectEntry.options[projectEntry.selectedIndex].value;
        const date = dateEntry.value;
        const hours = hoursEntry.value * 60 * 60 * 1000;
        // const key = keyBox.value;
        if (!editingKey) {
            console.log('submitting new entry');
            firebase.database().ref(userRef).push({
                submittedtime: {
                    ".sv": "timestamp"
                },
                project: project,
                hours: hours,
                date: date,
            });
        } else {
            console.log('updating old entry');
            firebase.database().ref(userRef + '/' + editingKey).set({
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
        enterhoursmodal.style.display = "none";
    }
    //EDIT MODAL

function editEntry(key) {
    console.log('editing: ' + key);
    enterhoursmodal.style.display = "block";
    enterTitle.style.display = "none";
    firebase.database().ref(userRef).once('value', function(snapshot) {
        oldHours = toHours(snapshot.val()[key].hours);
        oldDate = snapshot.val()[key].date;
        oldProject = snapshot.val()[key].project;
        console.log(key, ': ', oldHours, ', ', oldDate, ', ', oldProject);
        hoursEntry.value = oldHours;
        dateEntry.value = oldDate;
        projectEntry.value = oldProject;
        keyBox.value = key;
        editingKey = key
        console.log(keyBox.value);
    })
}

function deleteEntry(key) {
    console.log('deleting: ' + key);
    firebase.database().ref(userRef + '/' + key).once('value', function(snapshot) {
        // oldHours = toHours(snapshot.val()[key].hours);
        // oldDate = snapshot.val()[key].date;
        // oldProject = snapshot.val()[key].project;
        // console.log(key, ': ', oldHours, ', ', oldDate, ', ', oldProject);
        firebase.database().ref(userRef + '/deleted/' + key).set(snapshot.val(), function(error) {
            if (!error) {
                firebase.database().ref(userRef + '/deleted/' + key).update({
                    deleted: {
                        ".sv": "timestamp"
                    }
                })
                firebase.database().ref(userRef + '/' + key).remove();
            } else if (typeof(console) !== 'undefined' && console.error) {
                console.error(error);
            }
        });
    });
}
//DOWNLOAD TRIGGER
var invoice = document.getElementById("invoice");
invoice.onclick = function() {
    console.log('invoicing....');
    exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}



//create CSV
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
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

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

var headers = {
    model: 'Phone Model'.replace(/,/g, ''), // remove commas to avoid errors
    chargers: "Chargers",
    cases: "Cases",
    earphones: "Earphones"
};

itemsNotFormatted = [{
        model: 'Samsung S7',
        chargers: '55',
        cases: '56',
        earphones: '57',
        scratched: '2'
    },
    {
        model: 'Pixel XL',
        chargers: '77',
        cases: '78',
        earphones: '79',
        scratched: '4'
    },
    {
        model: 'iPhone 7',
        chargers: '88',
        cases: '89',
        earphones: '90',
        scratched: '6'
    }
];

var itemsFormatted = [];

// format the data
itemsNotFormatted.forEach((item) => {
    itemsFormatted.push({
        model: item.model.replace(/,/g, ''), // remove commas to avoid errors,
        chargers: item.chargers,
        cases: item.cases,
        earphones: item.earphones
    });
});

var fileTitle = 'orders'; // or 'my-unique-title'

function twoDigits(time) {
    return (time < 10 ? '0' : '') + time;
}

function toHours(ms) {
    return (Math.round((ms / 1000 / 60 / 60) * 4) / 4).toFixed(2)
}

function toMS(hours) {
    return hours * 1000 * 60 * 60
}