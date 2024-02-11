const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3001;

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

function generateUserToken(){
  return require('crypto').randomBytes(32).toString('hex');
}

async function generatePasswordHash(password){
  return  await bcrypt.hash(password, 10).catch(err => log(err, 1))
}
async function compareHash(password, hash){
  return await (bcrypt.compare(password, hash).catch(err => log(err, 1)))
}
app.post('/api/register', async (req, res) => {
  try {

    const { email, password,name } = req.body;

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({success: false, error: 'Email already registered' });
    }

    var token = generateUserToken();
    let passHash = await generatePasswordHash(password);
    passHash = passHash.toString();
    console.log({email, passHash, name, token})
    // Add the new user document to Firestore
    await userRef.set({ email, password: passHash, name, token});

    res.status(201).json({success: true, token: token, name: name });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({success: false,  error: 'Internal server error' });
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
      return res.json({ success: false, error: 'User not found' });
    }

    // Check if password matches
    const userData = userDoc.data();
    if (!await compareHash(password,userData.password)) {
      return res.json({ success: false, error: 'Incorrect password' });
    }

    // Password matches, user is authenticated
    res.json({ success: true, token: userData.token, name: userData.name });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/add-offer', async (req, res) => {
  try {
    // Extract email and offer data from the request body
    const { email, offer } = req.body;

    // Find the user document by email
    const userDocRef = db.collection('users').doc(email);
    const userDoc = await userDocRef.get();
    // Check if the user exists
    if (userDoc === undefined) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the user document reference
    const userData = userDoc.data();
    const updatedOffersData = { ...userData.offers, ...offer };
    await userDocRef.update({ offers: updatedOffersData });

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