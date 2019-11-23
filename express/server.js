require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const mountApp = require('./routes/index');
const fileUpload = require('express-fileupload')
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload())
mountApp(app);

app.get('*', (req,res) => res.json (({message: 'Welcome'})));

app.listen(PORT,() => console.log(`Server started on port ${PORT}...`));