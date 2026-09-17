/**
 * Firebase Web App config for the "Join the Party" newsletter signup.
 * This is CLIENT-SIDE config, not a secret — it's normal and safe for it to
 * ship in the compiled bundle (Firebase's real security boundary is the
 * Firestore security rules in firestore.rules, not hiding this object).
 *
 * TODO (Justin): fill in the 3 REPLACE_ME values below from the Firebase
 * console before deploying. To get them:
 *   1. https://console.firebase.google.com/project/atrollpath/settings/general
 *   2. Scroll to "Your apps" — if there's no Web app yet, click the "</>"
 *      (Web) icon to register one (any nickname is fine, e.g. "atrollpath-web").
 *   3. Firebase shows a `firebaseConfig` object — copy apiKey, appId, and
 *      storageBucket from it into the fields below (projectId,
 *      messagingSenderId, and authDomain are already filled in from the
 *      project info you gave me).
 */
export const firebaseConfig = {
  apiKey: 'REPLACE_ME_API_KEY',
  authDomain: 'atrollpath.firebaseapp.com',
  projectId: 'atrollpath',
  storageBucket: 'REPLACE_ME_STORAGE_BUCKET',
  messagingSenderId: '573335693965',
  appId: 'REPLACE_ME_APP_ID'
};
