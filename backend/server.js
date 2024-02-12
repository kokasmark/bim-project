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
    res.json({ success: true, token: token, name: userData.name, company: userData.company });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/add-offer', async (req, res) => {
  try {
    const { token, header } = req.body;

    // Retrieve the document reference for the company based on the company name
    const companyQuerySnapshot = await db.collection('companies').where('name', '==', header.companyName).get();

    // Check if the company document exists
    if (!companyQuerySnapshot.empty) {
      const companyDocRef = companyQuerySnapshot.docs[0].ref;

      // Access the "offers" subcollection for the company
      const offersCollectionRef = companyDocRef.collection('offers');

      // Add a new document to the "offers" subcollection with the offer data
      const offerDocRef = await offersCollectionRef.add({ header: header, data: "", status: 0 });

      // Retrieve the user document based on the token
      const userQuerySnapshotByToken = await db.collection('users').where('token', '==', token).get();

      // Check if the user document exists
      if (!userQuerySnapshotByToken.empty) {
        const userDocRefByToken = userQuerySnapshotByToken.docs[0].ref;

        // Access the "sentOffers" subcollection for the user and add a new document with a reference to the offer
        const sentOffersCollectionRef = userDocRefByToken.collection('sentOffers');
        await sentOffersCollectionRef.add({ offerRef: offerDocRef });

        res.status(200).json({ success: true, message: 'Offer uploaded successfully' });
      } else {
        res.status(400).json({ success: false, error: 'User not found' });
      }
    } else {
      res.status(400).json({ success: false, error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.post('/api/update-offer', async (req, res) => {
  try {
    const { companyName, offerId, data, status } = req.body;

    // Retrieve the document reference for the user based on the companyName
    const companyQuerySnapshot = await db.collection('companies').where('name', '==', companyName).get();

    // Check if the company document exists
    if (!companyQuerySnapshot.empty) {
      // There should be only one company document with a unique name
      const companyDocRef = companyQuerySnapshot.docs[0].ref;

      // Access the "offers" subcollection for the company
      const offersCollectionRef = companyDocRef.collection('offers');

      // Update the offer document with the provided offerId
      const offerDocRef = offersCollectionRef.doc(offerId);
      await offerDocRef.update({ data: data, status: status });

      res.status(200).json({ success: true, message: 'Offer updated successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/get-offers', async (req, res) => {
  try {
    const { token, companyName} = req.body;

    // Retrieve the document reference for the user based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists and if the user is an admin
    if (!userQuerySnapshot.empty) {
      const userData = userQuerySnapshot.docs[0].data();

      const companyQuerySnapshot = await db.collection('companies').where('name', '==', companyName).get();
      // There should be only one user document with a unique token
      const companyDocRef = companyQuerySnapshot.docs[0].ref;

      // Access the "offers" subcollection for the user
      const offersCollectionRef = companyDocRef.collection('offers');

      // Query the "offers" subcollection based on the companyName in the header
      const offersQuerySnapshot = await offersCollectionRef.limit(10).get();

      // Extract the "header" and "status" fields from each offer document
      const offers = offersQuerySnapshot.docs.map(doc => {
        const { header, status, data } = doc.data();
        const id = doc.id; // Retrieve the document ID
        return { id, header, data, status };
      });

      res.status(200).json({ success: true, offers });
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting offers:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/get-offers-person', async (req, res) => {
  try {
    const { token } = req.body;

    // Retrieve the document reference for the user based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const userDocRef = userQuerySnapshot.docs[0].ref;

      // Access the "sentOffers" subcollection for the user
      const sentOffersCollectionRef = userDocRef.collection('sentOffers');

      // Query the "sentOffers" subcollection
      const sentOffersQuerySnapshot = await sentOffersCollectionRef.limit(10).get();

      // Extract the "offerRef" fields from each sent offer document
      const offersPromises = sentOffersQuerySnapshot.docs.map(async (doc) => {
        const { offerRef } = doc.data();

        // Retrieve the offer document based on the reference
        const offerDocSnapshot = await offerRef.get();

        // Check if the offer document exists
        if (offerDocSnapshot.exists) {
          const { header, status, data } = offerDocSnapshot.data();
          const id = offerDocSnapshot.id;
          console.log({ id, header, data, status })
          return { id, header, data, status };
        } else {
          return null;
        }
      });

      // Wait for all offer retrieval promises to resolve
      const offers = await Promise.all(offersPromises);

      // Filter out null values (offers with IDs that do not exist)
      const validOffers = offers.filter(offer => offer !== null);

      res.status(200).json({ success: true, offers: validOffers });
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting offers:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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
app.post('/api/admin/add', async (req, res) => {
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