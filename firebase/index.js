const { firebase } = require('../config.json');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection } = require('firebase/firestore');

const app = initializeApp({ ...firebase });
const firestore = getFirestore(app);

module.exports = { firestore };
