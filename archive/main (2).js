console.log("running js");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const timer = document.getElementById("timer");
const projectSelector = document.getElementById("project");
const projectSelect = document.getElementById("projectselect");
const projectEntry = document.getElementById("projectentry");
const hours = document.getElementById("hours");
var database = firebase.database();
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
//INITIALIZE TIMER STATE
var starttime;
firebase.database().ref(userRef + '/active').on('value', function(snapshot) {
    console.log("active changed: ");
    console.log(snapshot.val());
    if (snapshot.exists() && snapshot.val().active) {
        projectSelector.style.color = "green";
        projectSelector.style.display = "none";
        const project = projectSelector.options[projectSelector.selectedIndex].value;
        projectSelect.innerHTML = "Project: " + project;
        console.log("trying to hide project");
    } else {
        projectSelector.style.color = "red";
        timer.innerHTML = "Ready to work?"
    }
    starttime = new Date(snapshot.val().starttime);
    console.log('start time is:  ' + starttime);
});
//INITIALIZE HOURS TABLE
firebase.database().ref(userRef).on('value', function(snapshot) {
    console.log(snapshot.val());
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
            console.log(entry.key);
            entries += '<td style="display:none">' + entry.key + '<td>';
            entries += '<td> <button id="' + entry.key + '" onClick="editEntry(this.id)"> ✎ </button> </td>';
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
        timer.innerHTML = hours + ':' + minutes + ':' + seconds;
    } else {
        timer.innerHTML = '';
    }
}, 1000);

function twoDigits(time) {
    return (time < 10 ? '0' : '') + time;
}
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
            firebase.database().ref('users/' + 'jeremy/' + newKey).set({
                starttime: {
                    ".sv": "timestamp"
                },
                stoptime: null,
                project: project,
            });
            console.log("startTimer running for project:", project);
        } else {}
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
            var date = new Date(snapshot.val().starttime).getFullYear() + '-' + (new Date(snapshot.val().starttime).getMonth() + 1) + '-' + new Date(snapshot.val().starttime).getDate();
            firebase.database().ref(userRef + '/active').set({
                active: false,
                key: null,
                starttime: null,
                project: null,
            });
            firebase.database().ref('users/' + 'jeremy/' + key).update({
                stoptime: stoptime,
                hours: hours,
                date: date,
            });
        }
    })
    timer.innerHTML = "Nice work today";
    console.log("timer stopped for current project")
}
// ENTER HOURS MODAL
var modal = document.getElementById("enterhours");
var btn = document.getElementById("enterhoursbtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
    editTitle.style.display = "none";
}
span.onclick = function() {
    console.log('closing...');
    modal.style.display = "none";
}
window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //SUBMIT HOURS 
var submit = document.getElementById("submit");
var dateEntry = document.getElementById("dateentry");
var hoursEntry = document.getElementById("hoursentry");
submit.onclick = function() {
        console.log("Submitting....");
        const project = projectEntry.options[projectEntry.selectedIndex].value;
        const date = dateEntry.value;
        const hours = hoursEntry.value * 60 * 60 * 1000;
        firebase.database().ref(userRef).push({
            submittedtime: {
                ".sv": "timestamp"
            },
            project: project,
            hours: hours,
            date: date,
        });
        modal.style.display = "none";
    }
    //EDIT MODAL
var editmodal = document.getElementById("edit");
// var editbtn = document.getElementById("editbtn");
var editspan = document.getElementsByClassName("close")[1];
var enterTitle = document.getElementById("enter-title");
var editTitle = document.getElementById("edit-title");

function editEntry(key) {
    console.log('editing: ' + key);
    modal.style.display = "block";
    enterTitle.style.display = "none";
    firebase.database().ref(userRef).once('value', function(snapshot) {
        console.log(key, snapshot.val().key);
        var hours = snapshot.val().key;
        console.log(hours);

    })
}
// editspan.onclick = function() {
//     console.log('closing...');
//     modal.style.display = "none";
// }
// window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = "none";
//         }
//     }
//EDIT HOURS
var submit = document.getElementById("submit");
var dateEntry = document.getElementById("dateentry");
var hoursEntry = document.getElementById("hoursentry");
submit.onclick = function() {
    console.log("Submitting....");
    const project = projectEntry.options[projectEntry.selectedIndex].value;
    const date = dateEntry.value;
    const hours = hoursEntry.value * 60 * 60 * 1000;
    firebase.database().ref(userRef).push({
        submittedtime: {
            ".sv": "timestamp"
        },
        project: project,
        hours: hours,
        date: date,
    });
    modal.style.display = "none";
}