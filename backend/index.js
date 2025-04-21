const express = require('express');
const cors = require('cors'); 
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const vendorRoutes = require('./routes/vendors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/vendors', vendorRoutes); // Mount the vendor routes on the /vendors path



app.get('/', (req, res) => {
  res.send('Dealsdash API is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

