// src/components/timer.js
import { db } from "../database/db";

//TICKING
export function ticking() {
  return setInterval(() => {
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
}

//START/STOP TIMER FUNCTIONS
export function startTimer() {
  console.log("running startTimer");
  db.ref(userRef + "/state")
    .once("value")
    .then(function (snapshot) {
      if (activepid) {
        // console.log("activeclient: ", activeClient);
        if (!snapshot.exists() || !snapshot.val().active) {
          /*THEN START TIMER*/ timer.innerHTML = "00:00:00";
          const currentTime = new Date();
          var newKey = db.ref(userRef).push().key;
          // console.log("2");
          // activeChallenge = [activeChallenges[activeChallenges.length - 1]];
          db.ref(userRef + "/state").set({
            active: true,
            key: newKey,
            starttime: {
              ".sv": "timestamp",
            },
            pid: activepid,
            challenges: activeChallenge,
            // client: activeClient,
          });
          // db.ref(userRef + "/uninvoiced" + "/" + newKey).set({
          //   starttime: {
          //     ".sv": "timestamp",
          //   },
          //   stoptime: null,
          //   project: activepid,
          // });
          console.log("startTimer running for project:", activepid);
        } /*THEN STOP TIMER*/ else {
          var key = snapshot.val().key;
          var stoptime = new Date();
          var starttime = snapshot.val().starttime;
          var hours = stoptime - starttime;
          var pid = activepid;
          var challenges = activeChallenges;
          // var client = activeClient;
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
            challenges: null,
          });
          db.ref(userRef + "/uninvoiced" + "/" + key).set({
            starttime: starttime,
            stoptime: {
              ".sv": "timestamp",
            },
            hours: hours,
            date: date,
            pid: pid,
            challenges: challenges,
            // client: client,
          });
        }
      } else {
        console.log("no project selected");
      }
    });
}
