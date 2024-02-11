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
    await userRef.set({ email, password: passHash, name, token, role: 0});

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

    var token = generateUserToken()
    await userRef.update({ token:  token});
    // Password matches, user is authenticated
    res.json({ success: true, token: token, name: userData.name });
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
app.post('/api/role', async (req, res) => {
  try {
    const { token } = req.body;

    // Query the user document based on the token field
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      // There should be only one user document with a unique token
      const userData = userQuerySnapshot.docs[0].data();
      res.status(200).json({ success: true, role: userData.role });
    } else {
      res.status(400).json({ success: false, error: 'User not found', role: -1 });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/new-admin', async (req, res) => {
  try {
    const { token, newAdmin } = req.body;

    // Query the user document based on the token field
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      // There should be only one user document with a unique token
      const userData = userQuerySnapshot.docs[0].data();
      if(userData.role === 1)
      {
        const newAdminQuery = await db.collection('users').where('email', '==', newAdmin).get();
        if(!newAdminQuery.empty){
          const newAdminDocRef = newAdminQuery.docs[0].ref;

          // Update the user document with the new role field value
          await newAdminDocRef.update({ role: 1 });
          res.status(200).json({ success: true, message: `New admin added: ${newAdmin}` });
        }
        else{
          res.status(400).json({ success: false, error: `Cant find user: ${newAdmin}` });
        }
       
      }
      else{
        res.status(400).json({ success: false, error: 'Cant add admin, no permission!'});
      }
    } else {
      res.status(400).json({ success: false, error: 'User not found', role: -1 });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/forgot-password', async (req, res) => {
    try {
      // Extract email and password from the request body
      const {email} = req.body;
  
      // Check if email exists in Firestore
      const userRef = db.collection('users').doc(email);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.json({ success: false, error: 'User not found' });
      }
  
      // Check if password matches
      const userData = userDoc.data();
      var nodemailer = require('nodemailer');
      var mail = require('./mail_template')
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'flexify.team2024@gmail.com',
          pass: 'ssck hvqx jskt kyqo'
        }
      });

      var mailOptions = {
        from: 'BIM-Project <flexify.team2024@gmail.com>',
        to: userData.email,
        subject: 'Reset Password',
        html: mail(userData.name, userData.token)//We sending the login token because it changes with every login either way
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).json({success: true, message: "Email sent to "+userData.email})
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Query the user document based on the token field
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      // There should be only one user document with a unique token
      const userData = userQuerySnapshot.docs[0].data();
      const userRef = userQuerySnapshot.docs[0].ref;
      var newToken = generateUserToken(); // for security reasons;
      let passHash = await generatePasswordHash(password);
      await userRef.update({ password: passHash, token: newToken });
      res.status(200).json({ success: true, message: 'Password successfully updated!'});
    } else {
      res.status(400).json({ success: false, error: 'User not found'});
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});