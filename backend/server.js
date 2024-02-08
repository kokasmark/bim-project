const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

app.post('/api/register', async (req, res) => {
  try {

    const { email, password } = req.body;

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Add the new user document to Firestore
    await userRef.set({ email, password });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/login', async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email exists in Firestore
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check if password matches
    const userData = userDoc.data();
    if (userData.password !== password) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // Password matches, user is authenticated
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/api/add-offer', async (req, res) => {
  try {
    // Extract email and offer data from the request body
    const { email, offer } = req.body;
    console.log(email)

    // Find the user document by email
    const userQuerySnapshot = await db.collection('Offers').where('email', '==', email).get();
    console.log(db.collection('Offers').doc(email))
    // Check if the user exists
    if (userQuerySnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the user's sub-table reference
    const userDocId = userQuerySnapshot.docs[0].id;
    const userOffersRef = db.collection('offers').doc(userDocId).collection('offers');

    // Add the offer to the user's sub-table
    await userOffersRef.add(offer);

    res.status(201).json({ message: 'Offer added successfully' });
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});