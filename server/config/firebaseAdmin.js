const { type } = require('@testing-library/user-event/dist/type');
const admin = require('firebase-admin');

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

const serviceAccount = {
    type : "service_account",
    project_id : process.env.FIREBASE_PROJECT_ID,
    private_key_id : process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key : privateKey,
    client_email : process.env.FIREBASE_CLIENT_EMAIL,
}

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL : process.env.FIREBASE_DATABASE_URL,
});

module.exports = admin;