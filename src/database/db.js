// src/database/db.js
export const db = firebase.database();

export function getUserRef(uid) {
  return db.ref(`users/${uid}`);
}
