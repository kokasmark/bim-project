const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = 3001;

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Initialize Firestore
const db = admin.firestore();

async function addNotification(email, message) {
  try {
    // Retrieve the user document based on the email
    const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const userDocRef = userQuerySnapshot.docs[0].ref;

      // Add the message to the user's notifications array
      await userDocRef.update({
        notifications: admin.firestore.FieldValue.arrayUnion(message)
      });

    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}
async function getNotifications(token) {
  try {
    // Retrieve the user document based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const userDocRef = userQuerySnapshot.docs[0].ref;

      // Get the user's notifications
      const userDocSnapshot = await userDocRef.get();
      const notifications = userDocSnapshot.data().notifications || [];

      // Clear the notifications array
      await userDocRef.update({
        notifications: []
      });

      return notifications;
    } else {
      console.error('User not found');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving and clearing notifications:', error);
    return [];
  }
}
async function addNotificationsForAdmins(message) {
  try {
    // Retrieve the first document from the Constants collection
    const constantsQuerySnapshot = await db.collection('Constants').limit(1).get();

    // Check if the Constants document exists
    if (!constantsQuerySnapshot.empty) {
      const constantsDoc = constantsQuerySnapshot.docs[0].data();
      const admins = constantsDoc.admins || [];

      // Iterate over the admins array and add a notification for each admin
      for (const adminEmail of admins) {
        await addNotification(adminEmail, message);
      }

      console.log('Notifications added for all admins');
    } else {
      console.error('Constants document not found');
    }
  } catch (error) {
    console.error('Error adding notifications for admins:', error);
  }
}
async function Log(company, message, token){
  const companyQuerySnapshot = await db.collection('companies').where('name', '==', company).get();
  const userRef = (await db.collection('users').where('token', '==', token).get()).docs[0];
  var user = userRef.data().email;
    // Check if the company document exists
    if (!companyQuerySnapshot.empty) {
      const companyDocRef = companyQuerySnapshot.docs[0].ref;

      // Access the "offers" subcollection for the company
      const offersCollectionRef = companyDocRef.collection('logs');

      // Add a new document to the "offers" subcollection with the offer data
      const offerDocRef = await offersCollectionRef.add({ message: message, user: user, timestamp: new Date().getTime()});
    }
}

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
    console.log(`${new Date().getTime()} - `,`New registration data: ${name}, ${email}`)
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
      return res.json({ success: false, error: 'A megadott adatok hibásak!' });
    }

    // Check if password matches
    const userData = userDoc.data();
    if (!await compareHash(password,userData.password)) {
      return res.json({ success: false, error: 'A megadott adatok hibásak!' });
    }

    console.log(`New Login - ${email}`);
    var token = generateUserToken()
    await userRef.update({ token:  token});

    getNotifications(token).then(n => {
      res.json({ success: true, token: token, name: userData.name, notifications: JSON.stringify(n)});
  });
    // Password matches, user is authenticated
    
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

//REWORKED
app.post('/api/add-offer', async (req, res) => {
  try {
    const { token, header,files } = req.body;

    // Add a new document to the "Jobs" collection with the offer data
    const offerDocRef = await db.collection('Jobs').add({ header: header, data: "", status: 0, files: files});

    // Retrieve the user document based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const userDocRef = userQuerySnapshot.docs[0].ref;

      // Access sentOffers
      const ordersCollectionRef = userDocRef.collection('sentOffers');
      
      addNotificationsForAdmins(`Egy új rendelés érkezett! Projekt: ${header.projectName}`)
      console.log(`${new Date().getTime()} - `,`New offer data: `,{header})
      // Add a new document to the "orders" subcollection with the offer reference
      await ordersCollectionRef.add({ id: offerDocRef.id });

      res.status(200).json({ success: true, message: 'Offer uploaded successfully' });
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});





app.post('/api/update-offer', async (req, res) => {
  try {
    const { offerId, data, status, token } = req.body;

    // Retrieve the document reference for the offer in the "Jobs" collection
    const offerDocRef = db.collection('Jobs').doc(offerId);
    const offerDocSnapshot = await offerDocRef.get();

    // Check if the offer document exists
    if (offerDocSnapshot.exists) {
      // Update the offer document with the provided data and status
      let updatedHeader = offerDocSnapshot.data().header;
      updatedHeader.updated = new Date().getTime();

      await offerDocRef.update({
        header: updatedHeader,
        data: data !== undefined ? data : offerDocSnapshot.data().data,
        status: status
      });

      // Log the update (assuming Log is a defined function)
      //Log(`Offer ${offerId} updated. Status: ${status}`, token);
      addNotification(updatedHeader.authorEmail,`A '${updatedHeader.projectName}' projekthez kapcsolódó rendelése frissült!`)
      console.log(`${new Date().getTime()} - `,`Offer updated data: `,{updatedHeader})
      res.status(200).json({ success: true, message: 'Offer updated successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Offer not found' });
    }
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.post('/api/get-offers', async (req, res) => {
  try {
    const { token, page } = req.body;
    const pageSize = 10;

    // Retrieve the document reference for the user based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const statuses = [0, 1, 2, 3, 4];
      const offers = [];

      for (let status of statuses) {
        // Query the "Jobs" collection with pagination for each status
        const jobsQuerySnapshot = await db.collection('Jobs')
          .where('status', '==', status)
          .orderBy('header.companyName') // Adjust the orderBy field as needed
          .limit(pageSize)
          .get();

        // Extract the necessary fields from each job document
        jobsQuerySnapshot.docs.forEach(doc => {
          const { header, status, data, offerId, files } = doc.data();
          const id = doc.id; // Retrieve the document ID
          offers.push({ id, header, data, status, offerId, files });
        });
      }

      res.status(200).json({ success: true, offers });
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting offers:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


//USER Retrieves its orders
app.post('/api/get-orders', async (req, res) => {
  try {
    const { token } = req.body;

    // Retrieve the user document based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists
    if (!userQuerySnapshot.empty) {
      const userId = userQuerySnapshot.docs[0].id;
      
      // Retrieve the user's sentOffers subcollection
      const sentOffersSnapshot = await db.collection('users').doc(userId).collection('sentOffers').get();

      const ordersPromises = [];

      // Iterate through each sent offer document
      sentOffersSnapshot.forEach(doc => {
        const sentOffer = doc.data();
        // Retrieve the offer document based on the offer ID
        const promise = db.collection('Jobs').doc(sentOffer.id).get().then(offerDocSnapshot => {
          if (offerDocSnapshot.exists) {
            const { header, status, data, offerId } = offerDocSnapshot.data();
            const id = offerDocSnapshot.id;
            return { id, header, data, status, offerId };
          } else {
            return null;
          }
        });
        ordersPromises.push(promise);
      });

      // Wait for all order retrieval promises to resolve
      const orders = await Promise.all(ordersPromises);

      // Filter out null values (orders with offer IDs that do not exist)
      const validOrders = orders.filter(order => order !== null);

      res.status(200).json({ success: true, orders: validOrders });
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});




app.post('/api/get-logs', async (req, res) => {
  try {
    const { company } = req.body;

    // Retrieve the document reference for the company based on its name
    const companyQuerySnapshot = await db.collection('companies').where('name', '==', company).get();

    // Check if the company document exists
    if (!companyQuerySnapshot.empty) {
      const companyDocRef = companyQuerySnapshot.docs[0].ref;

      // Access the "logs" subcollection for the company
      const logsCollectionRef = companyDocRef.collection('logs');

      // Query the "logs" subcollection
      const logsQuerySnapshot = await logsCollectionRef.limit(10).get();

      // Extract the data from each log document
      const logsPromises = logsQuerySnapshot.docs.map(async (doc) => {
        const { message, user, timestamp } = doc.data();
        return { message, user, timestamp };
      });

      // Wait for all log retrieval promises to resolve
      const logs = await Promise.all(logsPromises);

      res.status(200).json({ success: true, logs });
    } else {
      res.status(400).json({ success: false, error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error getting logs:', error);
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
      res.status(200).json({ success: true, role: userData.role});
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

app.post('/api/get-worktypes', async (req, res) => {
  try {
    // Query the first document in the Constants collection
    const constantsDocSnapshot = await db.collection('Constants').limit(1).get();

    // Check if the document exists
    if (!constantsDocSnapshot.empty) {
      const constantsDoc = constantsDocSnapshot.docs[0].data();
      res.status(200).json({ success: true, workTypes: constantsDoc.worktypes });
    } else {
      res.status(400).json({ success: false, error: 'Constants document not found' });
    }
  } catch (error) {
    console.error('Error getting work types:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/get-admins', async (req, res) => {
  try {
    // Query the users collection for documents where the role is 1
    const adminsQuerySnapshot = await db.collection('users').where('role', '==', 1).get();

    // Check if any admin documents were found
    if (!adminsQuerySnapshot.empty) {
      // Extract the admin data from the query snapshot
      const admins = adminsQuerySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });

      res.status(200).json({ success: true, admins });
    } else {
      res.status(200).json({ success: true, admins: [] });
    }
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/add-admin', async (req, res) => {
  try {
    const { token, email } = req.body;

    // Query the user document based on the token field
    const adminQuerySnapshot = await db.collection('users').where('token', '==', token).where('role', '==', 1).get();

    // Check if the admin document exists
    if (!adminQuerySnapshot.empty) {
      // If the user with the token is an admin, proceed to add a new admin
      const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();

      // Check if the user document exists
      if (!userQuerySnapshot.empty) {
        // There should be only one user document with a unique email
        const userDocRef = userQuerySnapshot.docs[0].ref;

        // Update the user's role to 1 (admin)
        await userDocRef.update({ role: 1 });

        res.status(200).json({ success: true, message: 'User role updated to admin successfully' });
      } else {
        res.status(400).json({ success: false, error: 'User not found' });
      }
    } else {
      res.status(403).json({ success: false, error: 'Permission denied: Only admins can add new admins' });
    }
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/update-worktype', async (req, res) => {
  try {
    const { token, worktype, action } = req.body; // action: 0 to remove, 1 to add

    // Retrieve the user document based on the token
    const userQuerySnapshot = await db.collection('users').where('token', '==', token).get();

    // Check if the user document exists and is an admin
    if (!userQuerySnapshot.empty) {
      const userData = userQuerySnapshot.docs[0].data();
      if (userData.role === 1) { // Check if the user is an admin
        // Query the first document in the Constants collection
        const constantsDocSnapshot = await db.collection('Constants').limit(1).get();

        // Check if the document exists
        if (!constantsDocSnapshot.empty) {
          const constantsDocRef = constantsDocSnapshot.docs[0].ref;
          const constantsDocData = constantsDocSnapshot.docs[0].data();
          let updatedWorktypes = constantsDocData.worktypes || [];

          // Validate worktype
          if (typeof worktype !== 'string' || !worktype.trim()) {
            return res.status(400).json({ success: false, error: 'Invalid worktype' });
          }

          if (action === 1) {
            // Add the worktype if it doesn't already exist
            if (!updatedWorktypes.includes(worktype)) {
              updatedWorktypes.push(worktype);
            }
          } else if (action === 0) {
            // Remove the worktype if it exists
            updatedWorktypes = updatedWorktypes.filter(wt => wt !== worktype);
          } else {
            return res.status(400).json({ success: false, error: 'Invalid action specified' });
          }

          // Ensure no undefined values in updatedWorktypes
          updatedWorktypes = updatedWorktypes.filter(wt => wt !== undefined);

          // Update the constants document with the new worktypes array
          await constantsDocRef.update({ worktypes: updatedWorktypes });

          res.status(200).json({ success: true, worktypes: updatedWorktypes });
        } else {
          res.status(400).json({ success: false, error: 'Constants document not found' });
        }
      } else {
        res.status(403).json({ success: false, error: 'User is not an admin' });
      }
    } else {
      res.status(400).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating work type:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.use(express.static("build"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});