console.log("running js");
// document.getElementById("timer").onClick.innerHTML = "It works!"
console.log("1");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const timer = document.getElementById("timer");
const projectSelector = document.getElementById("project");

var database = firebase.database();


startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);

function startedtime() {
    firebase.database().ref(userRef + '/active').on('value', function(snapshot) {
        console.log("active changed: ");
        console.log(snapshot.val());
        if (snapshot.exists() && snapshot.val().active) {
            timer.innerHTML = "timing.....";
            console.log('start time is:  ' + snapshot.val().starttime);
            return snapshot.val().starttime
        } else {
            timer.innerHTML = "Ready to work?"
        }
    });
}
var starttime = startedtime();
console.log(starttime);

firebase.database().ref(userRef).on('value', function(snapshot) {
    console.log(snapshot.val());
    var entries = '';
    snapshot.forEach(function(entry) {
        var cell = entry.val();
        entries += '<tr>';
        entries += '<td>' + new Date(cell.starttime) + '<td>';
        entries += '<td>' + new Date(cell.stoptime) + '<td>';
        entries += '<td>' + cell.project + '<td>';
        var time = (cell.stoptime - cell.starttime) / 1000 / 60 / 60;

        entries += '<td>' + time + '<td>';
        entries += '</tr>';

    });
    hours.innerHTML = entries;
})

// var starttime = firebase.database().ref(userRef).once('value').then(function(snapshot) {
//     return 'test'

//     console.log('start time: ' + starttime);
// });
// var starttime = 1599881555844
var x = setInterval(() => {
    var now = new Date().getTime();
    console.log('tick' + starttime);
    var distance = now - starttime
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    timer.innerHTML = hours + ':' + minutes + ':' + seconds;
}, 1000);

function startTimer() {
    console.log("running startTimer");
    firebase.database().ref(userRef + '/active').once('value').then(function(snapshot) {
        if (!snapshot.exists() || !snapshot.val().active) {
            timer.innerHTML = "timing.....";
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
                username: 'name',
                starttime: {
                    ".sv": "timestamp"
                },
                stoptime: null,
                project: project,
            });

            console.log("startTimer running for project:", project);
        } else {

        }
    });
}

function stopTimer() {
    console.log("running stopTimer");

    firebase.database().ref(userRef + '/active').once('value').then(function(snapshot) {
        if (snapshot.val().active) {
            timer.innerHTML = "Ready to work?";
            var key = snapshot.val().key

            firebase.database().ref(userRef + '/active').set({
                active: false,
                key: null,
                starttime: null,
                project: null,
            });
            firebase.database().ref('users/' + 'jeremy/' + key).update({
                stoptime: {
                    ".sv": "timestamp"
                },
            });

        }
    })
    timer.innerHTML = "Nice work today";
    console.log("timer stopped for current project")
}

// Modal
var modal = document.getElementById("enterhours");
var btn = document.getElementById("enterhoursbtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    console.log('closing...');
    modal.style.display = "none;"
}
window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //submit hours
var submit = document.getElementById("submit");

submit.onclick = function() {
    console.log("Submitting....");
    const project = projectSelector.options[projectSelector.selectedIndex].value;
    const currentTime = new Date();

    firebase.database().ref(userRef).push({
        starttime: {
            ".sv": "timestamp"
        },
        project: project,
    });
    firebase.database().ref('users/' + 'jeremy/' + newKey).set({
        username: 'name',
        starttime: {
            ".sv": "timestamp"
        },
        stoptime: null,
        project: project,
    });
    modal.style.display = "none";
}