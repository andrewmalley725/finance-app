/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");

const app = require('./app');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.app = functions.https.onRequest(app);
